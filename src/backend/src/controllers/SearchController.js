const dao = require('../dao/SearchDAO')
const daoExecution = require('../dao/SearchExecutionDAO')
const daoResult = require('../dao/SearchResultDAO')
const apis = require('../utils/apis')
const status = require('../utils/status')
const moment = require("moment")
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
    //console.log(res)
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
      result = await getDatabases({data:[result]})
      result = result.data
      result = result[0]
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

  const listExecutions = async (req, res) => {
    try {
        const { id } = req.params
        req.query["filterSearch"] = id
        let result = await daoExecution.getPage(req.query);
        return (res) ? res.json(result) : result;
    } catch (error) {
        return (res) ? res.status(500).json(`Error: ${error}`) : `Error: ${error}`
    }
  };

  const listResults = async (req, res) => {
    try {
        const { id } = req.params
        req.query["filterSearchExecution"] = id
        let result = await daoResult.getPage(req.query);
        let papers = []
        for (let i in result.data){
          if (result.data[i] && result.data[i].content && result.data[i].content.papers){
            papers = papers.concat(result.data[i].content.papers)
          }
        }
        result = {data:papers, total:papers.length}
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

  const play = async (req, res) => {
    const DAYS_WINDOW = 10
    try {
        const { id } = req.params
        let result = await dao.getById(id)
        result = await getDatabases({data:[result]})
        result = result.data
        result = result[0]
        let status_code = 200
        if (Object.keys(result).length === 0){
          status_code = 404
        }

        let since = null
        let until = null
        let days = null
      
        if (result){
          since = new Date(result.since)
          until = new Date(result.until)
          days = Math.floor((until.getTime() - since.getTime()) / (1000*60*60*24))
        }

        const slices = []
        let since_slice = since.getTime()
        while (!since_slice || (since_slice + DAYS_WINDOW*(1000*60*60*24)) < until.getTime()){
          if (since_slice!==since.getTime()){
            since_slice = since_slice + DAYS_WINDOW*(1000*60*60*24)
          }  
          let until_slice = since_slice + DAYS_WINDOW*(1000*60*60*24)
          if (until_slice > until.getTime()){
            until_slice = until.getTime()
          }

          slices.push(
            {
              since: moment(new Date(since_slice)).format("YYYY-MM-DD"),
              until: moment(new Date(until_slice)).format("YYYY-MM-DD")
            }
          )
          since_slice += (1000*60*60*24)
        }

        const tokens = []
        const databases = []
        for (let i in result.search_databases.objects){
            const credential = result.search_databases.objects[i]
            tokens.push(credential.credentials)
            databases.push(result.search_databases.objects[i].name)
        }
        
        /*
          CREATE THE EXECUTION
        */
       const newExecution ={
        id_search: result.id,
        total_slices: slices.length,
        date: new Date().toISOString(),
        status: status.created()
       }
       const searchExecution = await daoExecution.create(newExecution)

        for (let i in slices){
             /*
                CREATE THE RESULT
            */
            const newResult ={
                id_search_execution: searchExecution[0],
                slice: i,
                date: new Date().toISOString(),
                status: status.created()
            }
            const searchResult = await daoResult.create(newResult)

             /*
                MAKE THE SLICE SEARCH IN FINDPAPERS
            */
            const params = {
                query: result.string,
                since: slices[i].since,
                until: slices[i].until,
                databases: databases.join(","),
                tokens: {"list":tokens}
            }
            apis.post("search",params,"findpapers")
                .catch(async err =>{
                    let nowStatus = status.error()
                    nowStatus["date"] = new Date().toISOString()
                    newResult["status"] = nowStatus 
                    await daoResult.update(searchResult[0], newResult)
                    await updateExecutionStatus(searchExecution[0])
                })
                .then(async papers=>{
                    if (papers && papers.data){
                        newResult["content"] = papers.data
                        let nowStatus = status.finished()
                        nowStatus["date"] = new Date().toISOString()
                        newResult["status"] = nowStatus 
                        await daoResult.update(searchResult[0], newResult)
                        await updateExecutionStatus(searchExecution[0])
                    }
            })
        
        }
        result = slices
        return (res) ? res.status(status_code).json(result) : result;   
    } catch (error) {
        return res.status(500).json(`Error: ${error}`)

    }  
  };

  const updateExecutionStatus = async (execution_id) => {
    const results = await daoResult.getPage({filterSearch:execution_id})
    let newStatus = status.created()
    let finished = 0
    for (let i in results.data){
        const result = results.data[i]
        if (result.status.id === status.finished().id){
            finished = finished + 1
            newStatus = status.running()
        }
        if (result.status.id === status.error().id){
            newStatus = status.error()
            break
        }
    }

    execution = await daoExecution.getById(execution_id)
    if (execution.total_slices == finished){
        newStatus = status.finished()
    }

    await daoExecution.update(execution_id, {status:newStatus})
  }

  return {
    get,
    list,
    listExecutions,
    listResults,
    remove,
    update,
    create,
    play
  };
};
