'use strict'

/*
|--------------------------------------------------------------------------
| ModeratorSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Role = use('Role');
const User = use("App/Models/User")



class ModeratorSeeder {
    async run() {
        try {
            const user = await User.create({
                email: 'ivan@gmail.com',
                password: '123123',
                firstname: 'Ivan',
                lastname: 'Matviichuk',
                office: 'Khmelnytskyi',
                position: 'Junior Javascript Developer'
            });
            const role = await Role.findBy('slug', 'moderator')

            await user.roles().attach([role.id]);
        } catch (e) {
            console.log(e)
        }

    }

}

module.exports = ModeratorSeeder
