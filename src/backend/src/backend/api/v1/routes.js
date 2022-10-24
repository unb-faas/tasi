
/**
 * Swagger documentation provided by swagger-autogen (https://www.npmjs.com/package/swagger-autogen) 
 */

const config = require("../../../config/environment");
const express = require('express');
const router = express.Router();
function makeCallbackList(list,keycloak,checkRoles){
  if (apiProtected){
    let new_list = [keycloak.protect(checkRoles)]
    return new_list.concat(list) 
  }
  return list
}

module.exports = (app) => {       
    
  /*******************************************
  *                   Info
  ********************************************/
  router
    .route(`/info`)
    .get(
      app.controllers.InfoController.info
      /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
        #swagger.tags = ['Tools']
        #swagger.responses[200] = {
          description: "Successful"
        }
        */
    )   

  /*******************************************
  *                   Word Replace
  ********************************************/
  router
   .route(`/wordreplace`)
     .get(
       app.controllers.WordReplaceController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Replace']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.WordReplaceController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Replace']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {  
              "target": "",
              "replace": "",
            }
          }
         
       */
     )
   router
   .route(`/wordreplace/:id`)
     .get(
       app.controllers.WordReplaceController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Replace']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.WordReplaceController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Replace']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {    
              "target": "",
              "replace": "",
            }
          }
        */
     )
     .delete(
       app.controllers.WordReplaceController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Replace']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )
  
  /*******************************************
  *                   Word Filter
  ********************************************/
   router
   .route(`/wordfilter`)
     .get(
       app.controllers.WordFilterController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Filter']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.WordFilterController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Filter']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {  
              "word": "",
            }
          }
         
       */
     )
   router
   .route(`/wordfilter/:id`)
     .get(
       app.controllers.WordFilterController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Filter']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.WordFilterController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Filter']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {    
              "word": "",
            }
          }
        */
     )
     .delete(
       app.controllers.WordFilterController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Word Filter']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )

  /*******************************************
  *               Search Database
  ********************************************/
   router
   .route(`/searchdatabase`)
     .get(
       app.controllers.SearchDatabaseController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Database']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.SearchDatabaseController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Database']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {  
              "name": "",
              "credentials": {},
            }
          }
         
       */
     )
   router
   .route(`/searchdatabase/:id`)
     .get(
       app.controllers.SearchDatabaseController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Database']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.SearchDatabaseController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Database']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {    
              "name": "",
              "credentials": {},
            }
          }
        */
     )
     .delete(
       app.controllers.SearchDatabaseController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Database']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )


  /*******************************************
  *                  Search
  ********************************************/
   router
   .route(`/search`)
     .get(
       app.controllers.SearchController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
     .post(
       app.controllers.SearchController.create
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {  
              "description": "",
              "string": "",
              "since": "2014-01-01",
              "until": "2022-12-31",
              "search_databases": {"ids":[]},
            }
          }
         
       */
     )
   router
   .route(`/search/:id`)
     .get(
       app.controllers.SearchController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
     .put(
       app.controllers.SearchController.update
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['type'] = {
             in: 'body',
             type: "object",
             description: "update object",
             schema: {    
              "description": "",
              "string": "",
              "since": "2014-01-01",
              "until": "2022-12-31",
              "search_databases": {"ids":[]},
            }
          }
        */
     )
     .delete(
       app.controllers.SearchController.remove
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
         */
     )
    router
     .route(`/search/:id/play`)
       .get(
         app.controllers.SearchController.play
         /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
           #swagger.tags = ['Search']
           #swagger.responses[200] = { description: "Successful"}
           #swagger.responses[404] = { description: "Not Found" }
           #swagger.responses[500] = { description: "Error on server"}
         */
       )
    router
       .route(`/search/:id/executions`)
         .get(
           app.controllers.SearchController.listExecutions
           /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
             #swagger.tags = ['Search']
             #swagger.responses[200] = { description: "Successful"}
             #swagger.responses[404] = { description: "Not Found" }
             #swagger.responses[500] = { description: "Error on server"}
           */
         )
      router
        .route(`/search/:id/results`)
          .get(
            app.controllers.SearchController.listResults
            /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
              #swagger.tags = ['Search']
              #swagger.responses[200] = { description: "Successful"}
              #swagger.responses[404] = { description: "Not Found" }
              #swagger.responses[500] = { description: "Error on server"}
            */
          )


    /*******************************************
    *            Search Execution
    ********************************************/
     router
       .route(`/searchexecution/:id`)
          .delete(
            app.controllers.SearchExecutionController.remove
            /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
              #swagger.tags = ['Search Execution']
              #swagger.responses[200] = { description: "Successful"}
              #swagger.responses[404] = { description: "Not Found" }
              #swagger.responses[500] = { description: "Error on server"}
              */
          )
    
  /*******************************************
  *               Search Result
  ********************************************/
   router
   .route(`/searchresult`)
     .get(
       app.controllers.SearchResultController.list
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Result']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[500] = { description: "Error on server"}
         #swagger.parameters['page'] = {
                description: 'page',
                in: 'query',
                required: false
            }
         #swagger.parameters['size'] = {
                description: 'size',
                in: 'query',
                required: false
            }
         */
     )
   router
   .route(`/searchresult/:id`)
     .get(
       app.controllers.SearchResultController.get
       /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
         #swagger.tags = ['Search Result']
         #swagger.responses[200] = { description: "Successful"}
         #swagger.responses[404] = { description: "Not Found" }
         #swagger.responses[500] = { description: "Error on server"}
       */
     )
  
  router
    .route(`/searchresult/:id/replay`)
      .get(
        app.controllers.SearchResultController.replay
        /* >>> SWAGGER DOCUMENTATION (DONT DELETE) <<<
          #swagger.tags = ['Search Result']
          #swagger.responses[200] = { description: "Successful"}
          #swagger.responses[404] = { description: "Not Found" }
          #swagger.responses[500] = { description: "Error on server"}
        */
      )
     

  app.use(app.basePath, router);
};
