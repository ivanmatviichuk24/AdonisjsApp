'use strict'

class StoreArticle {
  get rules() {
    return {
      title: 'required|string|unique:articles',
      slug: 'required|slug|unique:articles',
      short_text: 'required|string',
      full_text: 'required|string',
      image: 'required|file|file_ext:png,jpg,jpeg,JPG|file_size:2mb|file_types:image'
    }
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

module.exports = StoreArticle
