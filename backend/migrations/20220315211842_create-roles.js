export const up = async (knex) => {
    await knex("roles").insert([ {name: "reader"}, {name: "author"}, {name: "admin"}])
}

export const down = async (knex) => {
    await knex("roles").where().del()
}