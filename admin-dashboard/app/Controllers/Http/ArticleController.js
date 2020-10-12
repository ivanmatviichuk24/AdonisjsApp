'use strict'

const Article = use('App/Models/Article');
const Drive = use('Drive')
const DataTablesService = use('DataTables');
const Helpers = use('Helpers');

class ArticleController {
    async render({ view }) {
        return view.render('dashboard.articles');
    }



    async getData({ request }) {
        const dataTablesService = new DataTablesService(Article);
        dataTablesService.setFields(['id', 'title', 'slug', 'short_text', 'full_text', 'image']);
        return await dataTablesService.process(request.all());
    }



    async create({ request }) {
        const data = request.only(['title', 'short_text', 'full_text', 'slug']);
        const image = request.file('image');

        const path = Helpers.publicPath('assets/images/blog');
        const name = `${data.slug}${Date.now()}.${image.extname}`


        const article = await Article.create({
            ...data,
            image: `/assets/images/blog/${name}`
        })

        await image.move(path, {
            name: name,
            overwrite: true
        })

        if (!image.moved()) {
            await article.delete()
            return response.status(422).send({
                success: false,
                errorMessages: image.error()
            })
        }

        return {
            success: true
        }
    }


    async uploadImage({ request }) {
        const image = request.file('image');
    }

    async deleteImage({ request }) {
        const image = request.file('image');
    }

    async update({ request }) {
        const { id } = request.params;
        const data = request.only(['title', 'short_text', 'full_text']);
        const image = request.file('image');
        data.slug = data.title.replace(/ /g, '-');

        const article = await Article.find(id);
        if (image) {

            const path = Helpers.publicPath('assets/images/blog');
            const name = `${data.slug}${Date.now()}.${image.extname}`;
            data.image = `/assets/images/blog/${name}`;

            await image.move(path, {
                name: name,
                overwrite: true
            })

            if (!image.moved()) {
                return response.status(422).send({
                    success: false,
                    errorMessages: image.error()
                })
            }
            await Drive.delete('./public/' + article.image)
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
        console.log(article.image);
        await Drive.delete('./public/' + article.image)
        await article.delete();
        return {
            success: true
        }
    }
}

module.exports = ArticleController
