export const up = async (knex) => {
    await knex.schema.createTable("roles", (table) => {
        table.increments("id").notNullable().unique()
        table.text("name").notNullable()
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })

    await knex.schema.createTable("users", (table) => {
        table.increments("id").unique()
        table.text("pseudo").unique().notNullable()
        table.text("email").unique().notNullable()
        table.string("passwordHash", 1000).unique().notNullable()
        table.string("passwordSalt", 1000).unique().notNullable()
        table.boolean("isSoftBan").defaultTo(false)
        table.integer("role_id").notNullable()
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.foreign("role_id").references("id").inTable("roles").onDelete("SET NULL")
    })

    await knex.schema.createTable("posts", (table) => {
        table.increments("id").unique()
        table.text("title").notNullable()
        table.text("content").notNullable()
        table.boolean("isPublished").notNullable()
        table.integer("author_id").notNullable()
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.foreign("author_id").references("id").inTable("users").onDelete("SET NULL").onDelete("SET NULL")
    })

    await knex.schema.createTable("comments", (table) => {
        table.increments("id").notNullable().unique()
        table.text("content").notNullable()
        table.integer("post_id").notNullable()
        table.integer("author_id").notNullable()
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.foreign("author_id").references("id").inTable("users").onDelete("SET NULL")
        table.foreign("post_id").references("id").inTable("posts").onDelete("SET NULL")
    })
}

export const down = async (knex) => {
    await knex.schema.dropTable("roles")
    await knex.schema.dropTable("comments")
    await knex.schema.dropTable("posts")
    await knex.schema.dropTable("users")
}