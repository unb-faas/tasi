const dao = require('../dao/SearchDAO')
const apis = require('../utils/apis');

module.exports = (app) => {


  const getDatabases = async (res) => {
    for (let i in res.data){
        let arrDatabases = []
        for (let x in res.data[i].search_databases.ids){
            const search_database_id = res.data[i].search_databases.ids[x]
            const search_database = await app.controllers.SearchDatabaseController.get({params:{id:search_database_id}})
            arrDatabases[x] = search_database
        }
        res.data[i].search_databases.objects = arrDatabases
    }
    console.log(res.data[0])
    return res
  }  

  const get = async (req, res) => {
    try {
      const { id } = req.params
      let result = await dao.getById(id)
      let status_code = 200
      if (Object.keys(result).length === 0){
        status_code = 404
      }
      //result = await getDatabases([result])[0]
      return (res) ? res.status(status_code).json(result) : result;        
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const list = async (req, res) => {
    try {
        let result = await dao.getPage(req.query);
        result = await getDatabases(result)
        return (res) ? res.json(result) : result;
    } catch (error) {
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }
  };

  const update = async (req, res) => {
    try {
        const { id } = req.params
        const result = await dao.update(id,req.body)
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;        
      } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  const create = async (req, res) => {
    try {
        const result = await dao.create(req.body)
        return res.json(result);
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };

  const remove = async (req, res) => {
    try {
        const { id } = req.params
        const result = await dao.remove(id)
        let status_code = 200
        if (!result){
          status_code = 404
        }
        return (res) ? res.status(status_code).json(result) : result;   
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }  
  };
  
  return {
    get,
    list,
    remove,
    update,
    create,
  };
};
