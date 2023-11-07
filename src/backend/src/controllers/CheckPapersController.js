const axios = require('axios');

module.exports = (app) => {
    const getListPapersAws = async (req, res) => {
        try {
            const {data} = req.body
            console.log("Artigos enviados: ", data.length)
            const url = 'https://sf7quu6ji9.execute-api.sa-east-1.amazonaws.com/checkPapers'
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            console.log("Artigos recebidos: ", responseJson.length)
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const getListPapersGoogle = async (req, res) => {
        try {
            const {data} = req.body
            console.log("Artigos enviados: ", data.length)
            const url = 'https://southamerica-east1-shaped-icon-390417.cloudfunctions.net/checkDuplicatePapers'
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            console.log("Artigos recebidos: ", responseJson.length)
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const getListPapersAzure = async (req, res) => {
        try {
            const {data} = req.body
            console.log("Artigos enviados: ", data.length)
            const url = 'https://checkduplicatepapers.azurewebsites.net/api/HttpTrigger1?code=fN8jmcyqhUYffzfmOYIFkbEu22pxLq_WYAvKALYItVzGAzFui1e69A=='
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            console.log("Artigos recebidos: ", responseJson.length)
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const localCheckPapers = (req, res) => {
        try {
            const {data} = req.body
            const map = new Map()
            data.forEach(item => {
                map.set(item.doi, item)
            })
            const uniqueList = Array.from(map.values())
            return res.status(200).json(uniqueList)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    return{
        getListPapersAws,
        getListPapersGoogle,
        getListPapersAzure,
        localCheckPapers
    }
};