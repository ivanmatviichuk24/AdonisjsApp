'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/


/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');



Route.group(() => {
    Route.get('/dashboard', async ({ view }) => {
        return view.render('dashboard.index');
    }).as('index')

    Route.get('/dashboard/users', 'UserController.renderUsers')
        .as('users')
        .middleware(['can:read_users']);

    Route.get('/dashboard/users/data', 'UserController.getData')
        .as('users-data')
        .middleware(['can:read_users']);

    Route.post("/dashboard/users/create", "UserController.create")
        .validator('StoreUser')
        .middleware(['can:create_users']);


    Route.post("/dashboard/users/edit/:id", "UserController.update")
        .validator('EditUser')
        .middleware(['can:update_users']);

    Route.get("/dashboard/users/delete/:id", "UserController.delete")
        .as('users-delete')
        .middleware(['can:delete_users']);

    Route.get('/dashboard/users/logout', 'UserController.logout')
        .as('logout')
}).middleware(['auth'])




Route.group(() => {
    Route.get('/dashboard/roles', 'RoleController.renderRoles')
        .as('roles').middleware(['can:read_roles'])

    Route.get('/dashboard/roles/data', 'RoleController.getData')
        .as('users-data').middleware(['can:read_roles'])

    Route.post("/dashboard/roles/create", "RoleController.create")
        .validator('StoreRole')
        .middleware(['can:create_roles']);

    Route.post("/dashboard/roles/edit/:id", "RoleController.update")
        .validator('EditRole')
        .middleware(['can:update_roles'])

    Route.get("/dashboard/roles/delete/:id", "RoleController.delete")
        .middleware(['can:delete_roles'])
}).middleware(['auth'])



Route.group(() => {
    Route.get('/dashboard/articles', 'ArticleController.render')
        .as('articles')
        .middleware(['can:read_articles']);

    Route.get('/dashboard/articles/data', 'ArticleController.getData')
        .as('users-data')
        .middleware(['can:read_articles']);

    Route.post('/dashboard/articles/create', 'ArticleController.create')
        .validator('StoreArticle')
        .middleware(['can:create_articles']);

    Route.post("/dashboard/articles/edit/:id", "ArticleController.update")
        .validator('EditArticle')
        .middleware(['can:update_articles']);




    Route.get("/dashboard/articles/delete/:id", "ArticleController.delete")
        .middleware(['can:delete_articles']);
}).middleware(['auth'])


Route.group(() => {

    Route.post("/dashboard/articles/images/", "AttachmentController.uploadImage")
        .middleware(['can:(update_articles || create_articles)']);

    Route.delete("/dashboard/articles/images/", "AttachmentController.deleteImage")
        .middleware(['can:(update_articles || create_articles)']);
});




Route.group(() => {


    Route.get('/blog', 'BlogController.renderBlog').as('blog');

    Route.get('/blog/articles/:slug', 'BlogController.renderArticle').as('blog-article');

    Route.get('/blog/not-found', 'BlogController.articleNotFound').as('blog-article-not-found');

    Route.get('/blog/:slug', 'BlogController.renderInfo').as('info');


});





Route.group(() => {
    Route.get('/dashboard/users/login', 'UserController.renderLogin').as('login');

    Route.post('/dashboard/users/login', 'UserController.login').validator('LoginUser');

}).middleware(['guest']);

