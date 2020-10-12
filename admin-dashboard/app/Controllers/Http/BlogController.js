'use strict'

const Article = use('App/Models/Article');
const DataTablesService = use('DataTables');


class BlogController {



    async renderBlog({ view, request }) {
        const data = request.only(['page', 'search'])
        const query = {
            start: (data.page - 1 || 0) * 10,
            length: 10,
            search: {
                value: data.search || ''
            }
        }
        const dataTablesService = new DataTablesService(Article);
        dataTablesService.setFields(['id', 'title', 'slug', 'short_text', 'full_text', 'image']);
        const articles = await dataTablesService.process(query);
        return await view.render('blog.blog', {
            search: data.search,
            ...articles
        });
    }

    async renderArticle({ view, request }) {
        const { slug } = request.params;
        const article = await Article.findBy('slug', slug);
        console.log(article);
        return await view.render('blog.article', {
            article: article
        });
    }

    async renderAbout({ view }) {
        return await view.render('blog.about');
    }

}

module.exports = BlogController
