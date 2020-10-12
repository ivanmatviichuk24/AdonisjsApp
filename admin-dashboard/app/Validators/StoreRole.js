'use strict'


/* const rawData = await Drive.get('permissions.json')
 const permissions = [].concat(...Object.values(JSON.parse(rawData))).join(',');
*/




class StoreRole {

  get rules() {
    return {
      name: 'required|string|unique:roles|min:6',
      slug: 'required|string|unique:roles|min:6',
      description: 'required|string|min:6',
      permissions: 'required|array',
      'permissions.*': 'exists:permissions,slug'
    }
  }
  get validateAll() {
    return true
  }

  get sanitizationRules() {
    return {
      name: 'trim',
      slug: 'trim',
      description: 'trim',
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send({
      success: false,
      errorMessages: errorMessages
    })
  }

}

module.exports = StoreRole
