const apis = require('./apis')
const status = require('./status')
const daoResult = require('../dao/SearchResultDAO')
const crypto = require('crypto');

module.exports = {

  async getTokens (search) {
    const tokens = []
    console.log("--------------------")
    
    console.log(search)
    
    
    console.log("--------------------")
    for (let i in search.search_databases.objects){
        const credential = search.search_databases.objects[i]
        const database = search.search_databases.objects[i].name
        if (Object.keys(credential.credentials).length){
          tokens.push(credential.credentials)
        }
    }
    return tokens
  },

  async findPapers (id, id_search_execution, params) {
    const newResult = daoResult.getById(id)
    return new Promise(async(resolve, reject) => {
      await apis.post("search",params,"findpapers")
        .catch(async err =>{
            console.log(err)
            let nowStatus = status.error()
            nowStatus["date"] = new Date().toISOString()
            nowStatus["err"] = err
            newResult["status"] = nowStatus 
            await daoResult.update(id, newResult)
            reject()
            //await app.controllers.SearchController.updateExecutionStatus(id_search_execution)
        })
        .then(async papers=>{
            if (papers && papers.data){
                for (let i in papers.data.papers){
                  papers.data.papers[i].id = crypto.randomUUID()
                }
                newResult["content"] = papers.data
                let nowStatus = status.finished()
                nowStatus["date"] = new Date().toISOString()
                newResult["status"] = nowStatus 
                await daoResult.update(id, newResult)
                resolve()
               // await app.controllers.SearchController.updateExecutionStatus(id_search_execution)
            }
    })
    })

    
  },
  
};