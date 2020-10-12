'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash');
const Role = use('Role');
Factory.blueprint('App/Models/User', async (faker) => {
  return {
    email: faker.email(),
    password: await Hash.make(faker.password()),
    firstname: faker.first(),
    lastname: faker.last(),
    office: faker.pickone(['London', 'New York', 'San Francisco', 'Edinburgh', 'Khmelnytskyi', 'Tokyo']),
    position: faker.pickone(['Secretary', 'Junior Javascript Developer', 'Sales Assistant', 'Javascript Developer', 'Software Engineer', 'Team Leader', 'Accountant', 'Systems Administrator'])
  }
})


class UserSeeder {
  async run() {
    try {
      const users = await Factory
        .model('App/Models/User')
        .createMany(15)

      const role = await Role.findBy('slug', 'content manager')
      for (let i = 0; i < users.length; i++) {
        await users[i].roles().attach([role.id]);
      }
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = UserSeeder
