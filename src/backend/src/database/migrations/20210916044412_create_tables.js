
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_word_replace', table => {
            table.increments('id').primary()
            table.string('target',255).notNull()
            table.string('replace',255).notNull()
        })

        .createTable('tb_word_filter', table => {
            table.increments('id').primary()
            table.string('word',255).notNull()
        })
        
        .createTable('tb_search_database', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.integer('parallelize').notNull().default(0)
            table.json('credentials')
        })

        .createTable('tb_search', table => {
            table.increments('id').primary()
            table.string('description',255).notNull()
            table.string('string',9999).notNull()
            table.timestamp('since')
            table.timestamp('until')
            table.timestamp('created_at')
            table.json('search_databases')
        })

        .createTable('tb_search_execution', table => {
            table.increments('id').primary()
            table.integer('id_search').references('id').inTable('tb_search').notNull()
            table.timestamp('date')
            table.integer('total_chunks')
            table.json('status')
        })

        .createTable('tb_search_result', table => {
            table.increments('id').primary()
            table.integer('id_search_execution').references('id').inTable('tb_search_execution').notNull()
            table.timestamp('date')
            table.string('query',9999)
            table.integer('chunk')
            table.string('database')
            table.timestamp('since')
            table.timestamp('until')
            table.json('status')
            table.json('content')
        })


};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_word_replace')
        .dropTable('tb_word_filter')
        .dropTable('tb_search_database')
        .dropTable('tb_search')
        .dropTable('tb_search_execution')
        .dropTable('tb_search_results')
};
