exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_word_replace").del()
  await knex("tb_word_filter").del()
  await knex("tb_search_database").del()
  await knex("tb_search").del()
  
  await knex("tb_word_replace")
    .then(function () {
      // Inserts seed entries
      return knex("tb_word_replace").insert([
        {     
          id: 1,
          target: "Function as a Service",
          replace: "FaaS",
        },
        {     
          id: 2,
          target: "Function-as-a-Service",
          replace: "FaaS",
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_word_replace_id_seq RESTART WITH 999;')

  await knex("tb_word_filter")
    .then(function () {
      // Inserts seed entries
      return knex("tb_word_filter").insert([
        {     
          id: 1,
          word: "at",
        },
        {     
          id: 2,
          word: "of",
        },
        {     
          id: 3,
          word: "the",
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_word_filter_id_seq RESTART WITH 999;')

  await knex("tb_search_database")
    .then(function () {
      // Inserts seed entries
      return knex("tb_search_database").insert([
        {     
          id: 1,
          name: "scopus",
          credentials: {
            token: ""
          }
        },
        {     
          id: 2,
          name: "ieee",
          credentials: {
            token: ""
          }
        }
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_search_database_id_seq RESTART WITH 999;')

  await knex("tb_search")
    .then(function () {
      // Inserts seed entries
      return knex("tb_search").insert([
        {     
          id: 1,
          description: "FaaS",
          string: "[serverless] OR [function-as-a-service] OR [function as a service] OR [backend-as-a-service] OR [backend as a service] OR [aws lambda] OR [google gloud platform] OR [azure functions]",
          since: "2014-01-01",
          until: "2022-12-31",
          created_at: "2022-10-14",
          search_databases: {ids:[1,2]},
          results: {}
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_search_id_seq RESTART WITH 999;')

};
