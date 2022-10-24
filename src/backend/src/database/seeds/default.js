exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_word_replace").del()
  await knex("tb_word_filter").del()
  await knex("tb_search_database").del()
  await knex("tb_search_result").del()
  await knex("tb_search_execution").del()
  await knex("tb_search").del()
  
  await knex("tb_word_replace")
    .then(function () {
      // Inserts seed entries
      return knex("tb_word_replace").insert([
        {     
            id: 1,
            target: "Infrastructure as a Service",
            replace: "IaaS",
            },
        {     
            id: 2,
            target: "Infrastructure-as-a-Service",
            replace: "IaaS",
        },
        {     
            id: 3,
            target: "Platform as a Service",
            replace: "PaaS",
            },
        {     
            id: 4,
            target: "Platform-as-a-Service",
            replace: "PaaS",
        },
        {     
            id: 5,
            target: "Function as a Service",
            replace: "FaaS",
        },
        {     
            id: 6,
            target: "Function-as-a-Service",
            replace: "FaaS",
        },
        {     
            id: 7,
            target: "platforms",
            replace: "platform",
        },
        {     
            id: 8,
            target: "applications",
            replace: "application",
        },
        {     
            id: 9,
            target: "functions",
            replace: "function",
        },
        {     
            id: 10,
            target: "\\(faas\\)",
            replace: "faas",
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
        {     
            id: 4,
            word: "and",
        },
        {     
            id: 5,
            word: "to",
        },
        {     
            id: 6,
            word: "for",
        },
        {     
            id: 7,
            word: "we",
        },
        {     
            id: 8,
            word: "a",
        },
        {     
            id: 9,
            word: "be",
        },
        {     
            id: 10,
            word: "that",
        },
        {     
            id: 11,
            word: "with",
        },
        {     
            id: 12,
            word: "this",
        },
        {     
            id: 13,
            word: "an",
        },
        {     
            id: 14,
            word: "is",
        },
        {     
            id: 15,
            word: "which",
        },
        {     
            id: 16,
            word: "in",
        },
        {     
            id: 17,
            word: "by",
        },
        {     
            id: 18,
            word: "on",
        },
        {     
            id: 19,
            word: "are",
        },
        {     
            id: 20,
            word: "can",
        },
        {     
            id: 21,
            word: "as",
        },
        {     
            id: 22,
            word: "our",
        },
        {     
            id: 23,
            word: "â©",
        },
        {     
            id: 24,
            word: "it",
        },
        {     
            id: 25,
            word: "but",
        },
        {     
            id: 26,
            word: "or",
        },
        {     
            id: 27,
            word: "from",
        },
        {     
            id: 28,
            word: "using",
        },
        {     
            id: 29,
            word: "not",
        },
        {     
            id: 30,
            word: "2014",
        },
        {     
            id: 31,
            word: "2015",
        },
        {     
            id: 32,
            word: "2016",
        },
        {     
            id: 33,
            word: "2017",
        },
        {     
            id: 34,
            word: "2018",
        },
        {     
            id: 35,
            word: "2019",
        },
        {     
            id: 36,
            word: "2020",
        },
        {     
            id: 37,
            word: "2021",
        },
        {     
            id: 38,
            word: "2022",
        },
        {     
            id: 39,
            word: "2023",
        }
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
          parallelize: 1,
          credentials: {
            name: "token-scopus",
            value: "f6e0c5433a4761a43aae1a974e38209f"
          }
        },
        {     
          id: 2,
          name: "ieee",
          parallelize: 0,
          credentials: {
            name: "token-ieee",
            value: "w5dt9tdxaprbgywajqbbue6y"
          }
        },
        {     
            id: 3,
            name: "acm",
            parallelize: 1,
            credentials: {}
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
          since: "2014-06-01",
          until: "2022-12-31",
          created_at: "2022-10-14",
          search_databases: {ids:[1,2,3]},
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_search_id_seq RESTART WITH 999;')

};
