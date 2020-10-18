'use strict'

const Article = use('App/Models/Article');
const DataTablesService = use('DataTables');


class BlogController {



    async renderBlog({ view, request }) {
        const data = request.only(['page', 'search'])
        const query = {
            start: (data.page - 1 || 0) * 10,
            length: 10,
            searchPanes: {
                type: ['article']
            },
            search: {
                value: data.search || ''
            }
        }
        const infoArticles = await Article.query().where('type', '=', 'info').fetch();
        const dataTablesService = new DataTablesService(Article);
        dataTablesService.setFields(['id', 'title', 'slug', 'short_text', 'full_text', 'image']);
        const articles = await dataTablesService.process(query);
        return await view.render('blog.blog', {
            info: infoArticles.rows,
            search: data.search,
            ...articles
        });
    }

    async renderArticle({ view, request, response }) {
        const { slug } = request.params;
        const article = await Article.findBy('slug', slug);
        const infoArticles = await Article.query().where('type', '=', 'info').fetch();
        if (!article || article.type !== 'article') {
            return response.route('blog-article-not-found')
        }
        return await view.render('blog.article', {
            info: infoArticles.rows,
            article: article
        });
    }

    async articleNotFound({ view }) {
        const infoArticles = await Article.query().where('type', '=', 'info').fetch();
        console.log(infoArticles)
        return await view.render('blog.404', {
            info: infoArticles.rows
        })
    }

    async renderInfo({ view, response, request }) {
        const { slug } = request.params;
        const article = await Article.findBy('slug', slug)
        const infoArticles = await Article.query().where('type', '=', 'info').fetch();
        if (!article || article.type !== 'info') {
            return response.route('blog-article-not-found')
        }
        return await view.render('blog.about', {
            info: infoArticles.rows,
            article: article
        });
    }

}

module.exports = BlogController
