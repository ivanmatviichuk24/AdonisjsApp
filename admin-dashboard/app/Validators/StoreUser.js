'use strict'

class StoreUser {
  get rules() {
    return {
      email: 'required|email|unique:users',
      password: 'required',
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

  get messages() {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send({
      success: false,
      errorMessages: errorMessages
    })
  }


  get sanitizationRules() {
    return {
      email: 'normalize_email',
      firstname: 'trim',
      lasttname: 'trim',
      office: 'trim',
      position: 'trim',
      role: 'trim'
    }
  }
}

module.exports = StoreUser
