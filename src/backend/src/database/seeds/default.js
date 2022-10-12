exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_word_replace").del()
  
  await knex("tb_word_replace")
    .then(function () {
      // Inserts seed entries
      return knex("tb_word_replace").insert([
        {     
          id: 1,
          name: "Function as a Service",
          acronym: "FaaS",
          active: 1
        },
        {     
          id: 2,
          name: "Function-as-a-Service",
          acronym: "FaaS",
          active: 1
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_word_replace_id_seq RESTART WITH 999;')

};
