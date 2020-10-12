'use strict'

/*
|--------------------------------------------------------------------------
| PermissionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Permission = use('Permission')
class PermissionSeeder {
  async createPermission(slug, name, description) {
    try {
      const permission = new Permission()
      permission.slug = slug
      permission.name = name
      permission.description = description
      return await permission.save()
    } catch (e) {
      console.log('This permission already exists')
    }
  }

  async run() {
    await this.createPermission('create_users', 'Create Users', 'create users permission');
    await this.createPermission('read_users', 'Read Users', 'read users permission');
    await this.createPermission('update_users', 'Update Users', 'update users permission');
    await this.createPermission('delete_users', 'Delete Users', 'delete users permission');



    await this.createPermission('create_roles', 'Create Roles', 'create roles permission');
    await this.createPermission('read_roles', 'Read Roles', 'read roles permission');
    await this.createPermission('update_roles', 'Update Roles', 'update roles permission');
    await this.createPermission('delete_roles', 'Delete Roles', 'delete roles permission');



    await this.createPermission('create_articles', 'Create Articles', 'create articles permission');
    await this.createPermission('read_articles', 'Read Articles', 'read articles permission');
    await this.createPermission('update_articles', 'Update Articles', 'update articles permission');
    await this.createPermission('delete_articles', 'Delete Articles', 'delete articles permission');
  }
}

module.exports = PermissionSeeder
