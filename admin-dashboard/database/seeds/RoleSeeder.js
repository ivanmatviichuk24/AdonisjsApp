'use strict'

/*
|--------------------------------------------------------------------------
| AclSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/



const Role = use('Role');

const Permission = use('Permission');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class RoleSeeder {
  async roleAdmin() {
    const roleAdmin = new Role()
    roleAdmin.name = 'Administrator'
    roleAdmin.slug = 'administrator'
    roleAdmin.description = 'manage administration privileges'
    await roleAdmin.save()
    await this.attachPermissions(roleAdmin, [
      "create_users",
      "update_users",
      "delete_users",
      "read_users",
      "create_roles",
      "update_roles",
      "delete_roles",
      "read_roles",
      "create_articles",
      "update_articles",
      "delete_articles",
      "read_articles"
    ])
  }

  async attachPermissions(role, permissionSlugs) {
    const permissions = Promise.all(permissionSlugs.map((perm) => Permission.findBy('slug', perm)));
    const permissionIds = (await permissions).map((perm) => perm.id);
    await role.permissions()
      .attach(permissionIds);
  }

  async roleModerator() {
    const roleModerator = new Role()
    roleModerator.name = 'Moderator'
    roleModerator.slug = 'moderator'
    roleModerator.description = 'manage moderator privileges'
    await roleModerator.save()

    await this.attachPermissions(roleModerator, ['create_users', 'update_users', 'read_users'])
  }

  async roleContentManager() {
    const roleContentManager = new Role()
    roleContentManager.name = 'Content Manager'
    roleContentManager.slug = 'content manager'
    roleContentManager.description = 'manage content'
    await roleContentManager.save()

    await this.attachPermissions(roleContentManager, ['read_users'])
  }

  async run() {
    try {
      await this.roleAdmin();
      await this.roleContentManager();
      await this.roleModerator();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = RoleSeeder
