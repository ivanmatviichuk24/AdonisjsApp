const { hooks } = require('@adonisjs/ignitor')





hooks.after.providersBooted(() => {

    const Validator = use('Validator')
    const Database = use('Database')

    const existsFn = async (data, field, message, args, get) => {
        const value = get(data, field)
        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
            */
            return
        }

        const [table, column] = args
        const row = await Database.table(table).where(column, value).first()

        if (!row) {
            throw message
        }
    }

    const slugFn = async (data, field, message, args, get) => {
        const value = get(data, field)
        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
            */
            return
        }
        if (value !== Validator.sanitizor.slug(value)) {
            throw message
        }
    }
    Validator.extend('slug', slugFn)
    Validator.extend('exists', existsFn)
})