'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {
  up() {
    this.create('permission_role', table => {
      table.increments()
      table.integer('permission_id').unsigned().index()
      table.foreign('permission_id').references('id').on('permissions').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('role_id').unsigned().index()
      table.foreign('role_id').references('id').on('roles').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('permission_role')
  }
}

module.exports = PermissionRoleTableSchema
