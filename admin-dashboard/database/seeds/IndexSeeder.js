'use strict'

/*
|--------------------------------------------------------------------------
| IndexSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const PermissionSeeder = new (require('./PermissionSeeder'))();
const RoleSeeder = new (require('./RoleSeeder'))();
const ModeratorSeeder = new (require('./ModeratorSeeder'))();
const AdminSeeder = new (require('./AdminSeeder'))()
const ContentManagerSeeder = new (require('./ContentManagerSeeder'))();


class IndexSeeder {
    async run() {
        await PermissionSeeder.run()
        await RoleSeeder.run()
        await AdminSeeder.run()
        await ModeratorSeeder.run()
        await ContentManagerSeeder.run()
    }
}

module.exports = IndexSeeder
