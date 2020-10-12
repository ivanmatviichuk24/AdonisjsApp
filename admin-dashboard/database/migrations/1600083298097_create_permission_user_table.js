'use strict'

const Schema = use('Schema')

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('permission_user', table => {
      table.increments()
      table.integer('permission_id').unsigned().index()
      table.foreign('permission_id').references('id').on('permissions').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('permission_user')
  }
}

module.exports = PermissionUserTableSchema
