'use strict'

const Helpers = use('Helpers');
const Drive = use('Drive');
const uniqueFilename = require('unique-filename')

class AttachmentController {
    async uploadImage({ request, response }) {
        const image = request.file('image', {
            types: ['image'],
            size: '2mb'
        });
        const path = Helpers.publicPath('assets/images/blog');
        const name = `${uniqueFilename('')}.${image.extname}`
        const location = `/assets/images/blog/${name}`


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
        return {
            success: true,
            location: location
        }
    }

    async deleteImage({ request }) {
        const { path } = request || request.all();
        await Drive.delete('./public/' + path)
        return {
            success: true
        }
    }

}

module.exports = AttachmentController
