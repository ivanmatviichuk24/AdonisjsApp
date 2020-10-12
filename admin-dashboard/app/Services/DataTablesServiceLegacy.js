

class DataTablesService {
    constructor(database, table) {
        this.database = database;
        this.table = table;
        this.fields = [];
        this.searchPanesFields = [];
        this.request = {};
        this.joinCallback;
    }
    compose(...fns) {
        const self = this;
        return fns.reduce((f, g) => (...args) => f.apply(self, [g.apply(self, [...args])]))
    };

    processSearch(query) {
        const { database, fields } = this;
        const { value } = this.request.search;
        return query.where(function () {
            fields.reduce((a, b) => a.orWhere(database.raw(`LOWER(${b}::text) like ?`, [`%${value.toLowerCase()}%`])), this)
        })
    }

    processOrdering(query) {
        const { columns, order } = this.request;
        return query.orderBy(columns[order[0].column].data, order[0].dir);
    }

    processPagination(query) {

        const { start, length } = this.request;
        return query.paginate(start / length + 1, length);
    }

    processQuery() {
        return this.database.select(this.fields).from(this.table);
    }

    setFields(fields) {
        this.fields = fields;
    }
    setJoinCallBack(joinCallback) {
        this.joinCallback = joinCallback
    }
    setSearchPanesFields(searchPanesFields) {
        this.searchPanesFields = searchPanesFields;
    }

    async processColumns() {

    }

    async recordTotal() {
        const count = await this.database
            .from(this.table)
            .count()
        return count[0].count
    }

    processSearchPanes(query, exept = "") {
        if (this.request.searchPanes) {
            const { searchPanes } = this.request;
            const columns = Object.keys(searchPanes).filter((val) => val !== exept);
            return query.where(function () {
                columns.reduce((a, b) => a.where(function () {
                    searchPanes[b].reduce((c, d) => c.orWhere(b, '=', d), this)
                }), this)
            })
        } else {
            return query;
        }
    }
    async processSearchPanesOptions() {
        if (this.searchPanesFields.length) {
            const columns = this.searchPanesFields;
            return await columns.reduce(async (a, b) => {
                a = await Promise.resolve(a);
                const arr = await this.database.table(this.table).distinct(b).pluck(b);
                const result = await Promise.all(arr.map(async (value) => {
                    const total = await this.database.table(this.table).where(b, '=', value).count();
                    const count = await this.processSearchPanes(this.database.table(this.table), b).where(b, '=', value).count();
                    return {
                        label: value,
                        value: value,
                        total: total[0].count,
                        count: count[0].count,
                    }
                }));
                a[b] = result;
                return a;
            }, {});
        } else {
            return;
        }
    }

    processJoin(query) {
        if (this.joinCallback) {
            return this.joinCallback(query);
        } else {
            return query;
        }
    }


    async process(request) {
        this.request = request;
        const { draw } = request;
        const { processJoin, processPagination, processOrdering, processSearch, processSearchPanes, processQuery } = this
        const result = await this.compose(processPagination, processOrdering, processSearch, processSearchPanes, processJoin, processQuery)();
        return {
            data: result.data,
            draw: draw,
            recordsFiltered: result.total,
            recordsTotal: await this.recordTotal(),
            searchPanes: {
                options: await this.processSearchPanesOptions()
            }
        }

    }
}

module.exports = DataTablesService;