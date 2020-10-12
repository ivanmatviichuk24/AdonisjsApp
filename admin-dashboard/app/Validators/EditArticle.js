'use strict'

class EditArticle {
    get rules() {
        const { id } = this.ctx.request.params;
        const image = this.ctx.request.file('image');
        const validations = {
            title: `required|string|unique:articles,title,id,${parseInt(id)}`,
            short_text: 'required|string',
            full_text: 'required|string'
        }
        if (image) {
            validations.image = 'file|file_ext:png,jpg,jpeg,JPG|file_size:2mb|file_types:image';
        }
        return validations;
    }
    get validateAll() {
        return true
    }

    async fails(errorMessages) {
        return this.ctx.response.status(422).send({
            success: false,
            errorMessages: errorMessages
        })
    }

    get sanitizationRules() {
        return {
            title: 'trim',
            shortText: 'trim',
            fullText: 'trim',
        }
    }
}

module.exports = EditArticle
