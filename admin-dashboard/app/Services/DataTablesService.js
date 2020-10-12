

const Database = use('Database');


class DataTablesService {
    constructor(model) {
        this.model = model
        this.fields = [];
        this.searchPanesFields = [];
        this.request = {};
        this.relationFields = [];
    }
    compose(...fns) {
        const self = this;
        return fns.reduce((f, g) => (...args) => f.apply(self, [g.apply(self, [...args])]))
    };

    processSearch(query) {
        const { fields, relationFields } = this;
        const { value } = this.request.search;
        return query.where(function () {
            this.where(function () {
                fields.reduce((a, b) => a.orWhere(Database.raw(`LOWER(${b}::text) like ?`, [`%${value.toLowerCase()}%`])), this)
            })
                .orWhere(function () {
                    relationFields.reduce((a, b) => a.whereHas(b.table, (builder) => {
                        b.fields.reduce((c, d) => c.orWhere(Database.raw(`LOWER(${b.table}.${d}::text) like ?`, [`%${value.toLowerCase()}%`])), builder)
                    }), this)
                })
        })
    }
    processOrdering(query) {
        const { columns, order } = this.request;
        if (!columns || !order) {
            return query.orderBy('updated_at', 'desc');
        }
        return query.orderBy(columns[order[0].column].data, order[0].dir);
    }

    processPagination(query) {
        const { start, length } = this.request;
        return query.paginate(parseInt(start / length + 1), length);
    }

    processQuery() {
        return this.model.query().select(this.fields);
    }

    setFields(fields) {
        this.fields = fields;
    }

    setRelationFields(relationFields) {
        this.relationFields = relationFields
    }

    setSearchPanesFields(searchPanesFields) {
        this.searchPanesFields = searchPanesFields;
    }

    async recordTotal() {
        const count = await this.model
            .query()
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
                const arr = await this.model.query().distinct(b).pluck(b);
                const result = await Promise.all(arr.map(async (value) => {
                    const total = await this.model.query().where(b, '=', value).count();
                    const count = await this.processSearchPanes(this.model.query(), b).where(b, '=', value).count();
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
        const { relationFields } = this;
        if (relationFields.length) {
            return relationFields.reduce((a, b) => a.with(b.table, (builder) => {
                builder.select(b.fields);
            }), query)
        } else {
            return query;
        }
    }


    async process(request) {
        const response = {};
        this.request = request;
        const { draw } = request;

        const { processJoin, processPagination, processOrdering, processSearch, processSearchPanes, processQuery } = this

        const result = await this.compose(processPagination, processOrdering, processSearch, processJoin, processSearchPanes, processQuery)();
        response.data = result.rows;
        if (draw) {
            response.draw = draw;
        }
        response.pages = result.pages;
        response.recordsFiltered = result.pages.total
        response.recordsTotal = await this.recordTotal()
        if (this.searchPanesFields.length) {
            response.searchPanes = {
                options: await this.processSearchPanesOptions()
            }
        }
        return response;
    }
}

module.exports = DataTablesService;