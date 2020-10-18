'use strict'

const User = use('App/Models/User')
const Role = use('Role')

const DataTablesService = use('DataTables');

class UserController {

    async renderUsers({ view }) {
        const roles = await Role.all();
        return view.render('dashboard.users', { roles: roles.rows.map(role => role.slug) });
    }

    async create({ request }) {
        const data = request.only(['email', 'password', 'firstname', 'lastname', 'office', 'position']);
        const user = await User.create(data);
        const roleSlug = request.only(['role']).role;
        const role = await Role.findBy('slug', roleSlug);
        await user.roles().attach(role.id);
        return {
            success: true
        }
    }

    async getData({ request }) {
        const dataTablesService = new DataTablesService(User);
        dataTablesService.setFields(['id', 'email', 'lastname', 'firstname', 'office', 'position']);
        dataTablesService.setSearchPanesFields(['office', 'position']);
        dataTablesService.setRelationFields([{
            table: 'roles',
            fields: ['id', 'slug']
        }])
        return await dataTablesService.process(request.all());
    }

    async renderLogin({ view }) {
        return view.render('dashboard.login');
    }

    async login({ request, response, auth, session }) {
        try {
            const data = request.only(['email', 'password']);
            const user = await auth
                .authenticator('session')
                .remember(true)
                .attempt(data.email, data.password);
            return response.route('index');
        }
        catch (e) {
            session
                .withErrors([{ field: 'email', message: 'Unable to login.' }])
                .flashAll()
            return response.status(422).route('login')
        }
    }

    async update({ request }) {
        const { id } = request.params;
        const data = request.only(['email', 'firstname', 'lastname', 'office', 'position']);
        const user = await User.find(id);
        await user.merge(data);
        await user.save();
        return { success: true }
    }

    async delete({ request, response }) {
        const { id } = request.params;
        const user = await User.find(id);
        await user.delete();
        return response.redirect('back');
    }

    async logout({ auth, response }) {
        await auth.logout();
        return response.route('login');
    }
}

module.exports = UserController
