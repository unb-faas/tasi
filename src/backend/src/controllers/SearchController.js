const dao = require('../dao/SearchDAO')
const daoExecution = require('../dao/SearchExecutionDAO')
const daoResult = require('../dao/SearchResultDAO')
const daoWordReplace = require('../dao/WordReplaceDAO')
const daoWordFilter = require('../dao/WordFilterDAO')
const apis = require('../utils/apis')
const searchTool = require('../utils/search')
const status = require('../utils/status')
const words = require('../utils/words')
const moment = require("moment")
module.exports = (app) => {


  const getDatabases = async (res) => {
    for (let i in res.data){
        let arrDatabases = []
        if (res.data[i].search_databases){
            for (let x in res.data[i].search_databases.ids){
                const search_database_id = res.data[i].search_databases.ids[x]
                const search_database = await app.controllers.SearchDatabaseController.get({params:{id:search_database_id}})
                arrDatabases[x] = search_database
            }
            res.data[i].search_databases.objects = arrDatabases
        }
    }
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
          if (result.data[i] && result.data[i].content && result.data[i].content.papers.length){
            let newPapers = result.data[i].content.papers
            for (let x in newPapers){
              newPapers[x].id_search_result = result.data[i].id
            }
            papers = papers.concat(newPapers)
          }
        }
        papers = papers.filter(row=>{
            return row.publication.category && row.publication.category.trim() !== "Conference Proceedings" && row.publication.category.trim() !== "Book" && !!row.removed !== true
        })
    
        result = {data:papers, total:papers.length}

        if (req.query.wordcloud){
            result = await words.frequency(papers, req.query.attribute || "title", req.query.words || 200, req.query.weight || 50)
        }

        if (req.query.ranking){
          let years = []
          for (let i in papers){
            if (papers[i].publication_date){
              years.push(new Date(papers[i].publication_date).getFullYear())
            }
          }
          const yearsUnique = [ ...new Set(years)]
          years = []
          for (let i in yearsUnique){
            const year = yearsUnique[i]
            const objYear = {"year":year,papers:[]}
            for (let x in papers){
              if (new Date(papers[x].publication_date).getFullYear() == year){
                objYear.papers.push(papers[x])
              }
            }
            objYear["frequency"] = await words.frequency(objYear.papers, req.query.attribute || "title", req.query.words || 10, 1)
            delete objYear["papers"]
            years.push(objYear)
          }

          const temp = years.map(row=>row.frequency.data.map(subrow=>subrow.text))
          const wordlist = [...new Set(temp.flat())]

          let res = wordlist.map(word=>{
            const data = []
            let found = false
            for (let i in years){
              found = false
              for (let x in years[i].frequency.data){
                if (years[i].frequency.data[x].text == word){
                  found = true
                  data.push(years[i].frequency.data[x].value)
                }
              }
              if (!found){
                data.push(0)
              }
            }
            return {name:word,data:data}
          })
          res = res.filter(i=>i.name!=="")
          result = {result:res,categories:years.map((i,y)=>i.year)}
      }

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
        let search = await dao.getById(id)
        search = await getDatabases({data:[search]})
        search = search.data
        search = search[0]
        let status_code = 200
        if (Object.keys(search).length === 0){
          status_code = 404
        }

        let since = null
        let until = null
        let days = null
      
        if (search){
          since = new Date(search.since)
          until = new Date(search.until)
          days = Math.floor((until.getTime() - since.getTime()) / (1000*60*60*24))
        }

        const chunks = []
        const tokens = []
        for (let i in search.search_databases.objects){
            const credential = search.search_databases.objects[i]
            const database = search.search_databases.objects[i].name
            if (Object.keys(credential.credentials).length){
              tokens.push(credential.credentials)
            }
            if (parseInt(search.search_databases.objects[i].parallelize,10) === 1){
                let since_chunk = since.getTime()
                while (!since_chunk || (since_chunk + DAYS_WINDOW*(1000*60*60*24)) < until.getTime()){
                if (since_chunk!==since.getTime()){
                    since_chunk = since_chunk + DAYS_WINDOW*(1000*60*60*24)
                }  
                let until_chunk = since_chunk + DAYS_WINDOW*(1000*60*60*24)
                if (until_chunk > until.getTime()){
                    until_chunk = until.getTime()
                }

                chunks.push(
                    {
                    database: database,
                    since: moment(new Date(since_chunk)).format("YYYY-MM-DD"),
                    until: moment(new Date(until_chunk)).format("YYYY-MM-DD")
                    }
                )
                since_chunk += (1000*60*60*24)
                }
            } else {
                chunks.push(
                    {
                    database: database,
                    since: moment(new Date(since)).format("YYYY-MM-DD"),
                    until: moment(new Date(until)).format("YYYY-MM-DD")
                    }
                )
            }
        }

             /*
              CREATE THE EXECUTION
            */
            const newExecution ={
                id_search: search.id,
                total_chunks: chunks.length,
                date: new Date().toISOString(),
                status: status.created()
            }
            const searchExecution = await daoExecution.create(newExecution)

            let count = 0
            const requestLimit = 10
            for (let i in chunks){
                /*
                    CREATE THE RESULT
                */
                const newResult ={
                    id_search_execution: searchExecution[0],
                    chunk: i,
                    query: search.string,
                    database: chunks[i].database,
                    since: chunks[i].since,
                    until: chunks[i].until,
                    date: new Date().toISOString(),
                    status: status.created()
                }
                const searchResult = await daoResult.create(newResult)

                /*
                    MAKE THE chunk SEARCH IN FINDPAPERS
                */
                const params = {
                    query: search.string,
                    since: chunks[i].since,
                    until: chunks[i].until,
                    databases: chunks[i].database,
                    tokens: {"list":tokens}
                }

                while (count>=requestLimit){
                  await new Promise(resolve => setTimeout(resolve, 5000));
                }

                searchTool.findPapers(searchResult[0], searchExecution[0], params).then(()=>{
                    count--
                })
                count++
            }
        
                
        search = chunks
        return (res) ? res.status(status_code).json(search) : search;   
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
        if (parseInt(result.status.id,10) === parseInt(status.finished().id,10)){
            finished = finished + 1
            newStatus = status.running()
        }
        if (parseInt(result.status.id,10) === parseInt(status.error().id,10)){
            newStatus = status.error()
            break
        }
    }

    execution = await daoExecution.getById(execution_id)
    if (execution.total_chunks == execution.chunks_finished){
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
    play,
    updateExecutionStatus
  };
};
