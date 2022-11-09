
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_category', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_category')
};
