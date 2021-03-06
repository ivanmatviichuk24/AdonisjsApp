'use strict'

class LoginUser {
  get rules() {
    return {
      email: 'required|email',
      password: 'required'
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

  get sanitizationRules() {
    return {
      email: 'normalize_email',
    }
  }
}

module.exports = LoginUser
