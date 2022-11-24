const dao = require('../dao/SearchResultDAO')
const search = require('../utils/search')
const moment = require("moment")
const status = require('../utils/status')

module.exports = (app) => {

  const get = async (req, res) => {
    try {
      const { id } = req.params
      let result = await dao.getById(id)
      let status_code = 200
      if (Object.keys(result).length === 0){
        status_code = 404
      }
      return (res) ? res.status(status_code).json(result) : result;        
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const list = async (req, res) => {
    try {
        let result = await dao.getPage(req.query);
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

  const replay = async (req, res) => {
    try {
      const { id } = req.params
      let result = await dao.getById(id)
      let status_code = 200
      if (Object.keys(result).length === 0){
        status_code = 404
      }
      if (result.status && parseInt(result.status.id,10) === status.error().id){
        const tokens = await app.controllers.SearchDatabaseController.getTokens({query:{}})
        const params = {
            query: result.query,
            since:  moment(new Date(result.since)).format("YYYY-MM-DD"),
            until:  moment(new Date(result.until)).format("YYYY-MM-DD"),
            databases: result.database,
            tokens: {"list":tokens}
        }
        await search.findPapers(id, result.id_search_execution, params)
      }
      return (res) ? res.status(status_code).json(result) : result;        
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const removePaper = async (req, res) => {
    try {
      const { id, id_search_result } = req.params
      let result = await dao.getById(id_search_result)
      let status_code = 200
      for (let i in result.content.papers){
        if (result.content.papers[i].id === id){
          result.content.papers[i].removed = true
          break
        }
      }
      await dao.update(id_search_result,result)
      return (res) ? res.status(status_code).json(result) : result;        
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)
    }
  };

  const updatePaper = async (req, res) => {
    try {
      const { id, id_search_result } = req.params
      const { selected } = req.query
      const selectedCategories = selected.split(",")
      let result = await dao.getById(id_search_result)
      let status_code = 200
      for (let i in result.content.papers){
        if (result.content.papers[i].id === id){
          result.content.papers[i].selected_categories = selectedCategories
          break
        }
      }
      await dao.update(id_search_result,result)
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
    replay,
    removePaper,
    updatePaper
  };
};
