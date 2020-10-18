'use strict'

const Article = use('App/Models/Article');
const DataTablesService = use('DataTables');
const attachmentController = new (use('App/Controllers/Http/AttachmentController'))();


class ArticleController {
    async render({ view }) {
        return view.render('dashboard.articles');

    }

    async getData({ request }) {
        const dataTablesService = new DataTablesService(Article);
        dataTablesService.setFields(['id', 'title', 'slug', 'short_text', 'full_text', 'image', 'type']);
        return await dataTablesService.process(request.all());
    }



    async create({ request }) {
        const data = request.only(['title', 'short_text', 'full_text', 'slug', 'type']);
        const result = await attachmentController.uploadImage({ request });
        await Article.create({
            ...data,
            image: result.location
        })
        return {
            success: true
        }
    }


    async update({ request }) {
        const { id } = request.params;
        const data = request.only(['title', 'short_text', 'full_text', 'slug']);
        const image = request.file('image');
        const article = await Article.find(id);
        if (image) {
            const result = await attachmentController.uploadImage({ request });
            data.image = result.location;
            request.path = article.image;
            await attachmentController.deleteImage({ request })
        }
        article.merge(data);
        await article.save();
        return {
            success: true
        }
    }

    async delete({ request }) {
        const { id } = request.params;
        const article = await Article.find(id);
        request.path = article.image;
        await attachmentController.deleteImage({ request })
        await article.delete();
        return {
            success: true
        }
    }
}

module.exports = ArticleController
