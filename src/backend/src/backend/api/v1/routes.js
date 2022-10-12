
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

  app.use(app.basePath, router);
};
