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
            const url = 'https://checkduplicatepapers.azurewebsites.net/api/HttpTrigger1?code=M61lLSNh_U-biYRY6iHfZv5wbJTVzb2INHBmdCcmquMXAzFuJ3La9w=='
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
    const getListPapersDigitalocean = async (req, res) => {
        try {
            const {data} = req.body
            const dataToSend = {
                papers: data
            };
            const url = 'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-72e3186e-a5ae-4dd8-8890-8c9ab664dcb7/default/verify_papers'
            const response = await axios.post(url, dataToSend, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ODgzN2Q0OGMtYzgyMS00OWFlLWFmNDgtMDQ4MDQzMGY4MTk5OmVXcjZFbklXVnR6b24wcWRsT2FaM2s5UGlPT3V0cFUxSDQyejQ5ZlVaMWxGTjhaSlkzZU1oVW9KSUk3Z2h4cVo='
                },
            });
            const responseJson = await response.data
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
        getListPapersDigitalocean,
        localCheckPapers
    }
};