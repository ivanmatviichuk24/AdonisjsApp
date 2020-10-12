'use strict'


/* const rawData = await Drive.get('permissions.json')
 const permissions = [].concat(...Object.values(JSON.parse(rawData))).join(',');
*/



class EditRole {

    get rules() {
        const id = this.ctx.params.id
        return {
            name: `required|string|unique:roles,name,id,${id}|min:6`,
            slug: `required|string|unique:roles,slug,id,${id}|min:6`,
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
        console.log(await this.ctx.request.all());
        return this.ctx.response.status(422).send({
            success: false,
            errorMessages: errorMessages
        })
    }

}

module.exports = EditRole
