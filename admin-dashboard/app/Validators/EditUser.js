'use strict'

class EditUser {
  get rules() {
    return {
      firstname: 'required',
      lastname: 'required',
      position: 'required',
      office: 'required',
      role: 'required|exists:roles,slug'
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
      firstname: 'trim',
      lasttname: 'trim',
      office: 'trim',
      position: 'trim',
      role: 'trim'
    }
  }
}

module.exports = EditUser
