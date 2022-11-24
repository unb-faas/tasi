
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_search_question', table => {
            table.increments('id').primary()
            table.integer('id_search').references('id').inTable('tb_search').notNull()
            table.string('description',500)
        })

        .createTable('tb_search_question_answer', table => {
            table.increments('id').primary()
            table.integer('id_search_question').references('id').inTable('tb_search_question').notNull()
            table.string('description',500)
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_search_question')
        .dropTable('tb_search_question_answer')
};
