'use strict'


const Drive = use('Drive');

const DataTablesService = use('DataTables');
const Role = use('Role')
const Permission = use('Permission')



class RoleController {

    async renderRoles({ view }) {
        const rawData = await Drive.get('./tmp/permissions.json')
        const { permissions } = JSON.parse(rawData);
        return view.render('dashboard.roles', { permissions: permissions });
    }

    async create({ request }) {
        const data = request.only(['name', 'slug', 'description']);
        const role = await Role.create(data);
        const { permissions: permissionSlugs } = await request.all();
        const permissions = await Promise.all(permissionSlugs.map(elem => Permission.findBy('slug', elem)));
        await role.permissions().attach(permissions.map(elem => elem.id));
        return {
            success: true
        }
    }

    async getData({ request }) {
        const dataTablesService = new DataTablesService(Role);
        dataTablesService.setFields(['id', 'name', 'slug', 'description']);
        dataTablesService.setRelationFields([{
            table: 'permissions',
            fields: ['id', 'slug']
        }])
        return await dataTablesService.process(request.all());
    }

    async update({ request }) {
        const { id } = request.params;
        const role = await Role.find(id);
        const data = request.only(['name', 'slug', 'description']);
        role.merge(data);
        await role.save();
        const { permissions: permissionSlugs } = await request.all();
        if (permissionSlugs) {
            const permissions = await Promise.all(permissionSlugs.map(elem => Permission.findBy('slug', elem)));
            await role.permissions().sync(permissions.map(elem => elem.id));
        } else {
            await role.permissions().detach()
        }
        return {
            success: true
        };
    }

    async delete({ request, response }) {
        const { id } = request.params;
        const role = await Role.find(id);
        await role.delete();
        return response.redirect('back');
    }


}

module.exports = RoleController
