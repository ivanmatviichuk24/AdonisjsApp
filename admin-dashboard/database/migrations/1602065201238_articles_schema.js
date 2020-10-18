'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticlesSchema extends Schema {
  up() {
    this.create('articles', (table) => {
      table.increments()
      table.string('title', 255).notNullable().unique()
      table.string('slug', 255).notNullable().unique()
      table.string('short_text', 500).notNullable()
      table.string('full_text', 1500).notNullable()
      table.string('image', 255).notNullable()
      table.string('type', 100).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('articles')
  }
}

module.exports = ArticlesSchema
