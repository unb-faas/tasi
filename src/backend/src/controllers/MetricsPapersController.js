const axios = require('axios');
const natural = require('natural');

module.exports = (app) => {
    const postMetricsPapersAws = async (req, res) => {
        try {
            const {data} = req.body
            const url = 'https://ezq21t35h9.execute-api.us-east-2.amazonaws.com/metrics'
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const postMetricsPapersGoogle = async (req, res) => {
        try {
            const {data} = req.body
            const url = 'https://southamerica-east1-shaped-icon-390417.cloudfunctions.net/metricsPapers'
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const postMetricsPapersAzure = async (req, res) => {
        try {
            const {data} = req.body
            const url = 'https://metricspapers.azurewebsites.net/api/HttpTrigger1?code=rQOmIO2lenf1aqUk3zg1aNsEX2OQblEMHcC6ULYl-enfAzFur6IHtg=='
            const response = await axios.post(url, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseJson = await response.data
            return res.status(200).json(responseJson)
        } catch (error) {
            return res.status(500).json(`Error: ${error}`)
        }
    };
    const postMetricsPapersLocal = async (req, res) => {
        try{
            const {data} = req.body
            const stopWords = [
                "the", "a", "an", "is", "are", "like", "alike", "about", "be", "may", "can", "assumed", "full", "do", "has", "self",
                "in", "on", "at", "of", "as", "to", "with", "by", "for", "from", "into", "onto", "upon", "over", "under", "both", "use",
                "through", "between", "among", "during", "before", "after", "beside", "around", "behind", "above", "below", "beyond", "make",
                "and", "or", "but", "because", "if", "when", "although", "since", "while", "unless", "however", "therefore", "all", "made",
                "nevertheless", "furthermore", "moreover",
                "I", "me", "you", "he", "him", "she", "her", "it", "we", "us", "they", "them", "show", "now", "being", "less", "does", "not",
                "my", "mine", "your", "yours", "his", "her", "hers", "its", "our", "ours", "their", "theirs", "than", "run", "runing", "local",
                "who", "whom", "whose", "what", "which", "why", "where", "when", "how", "any", "form", "also", "etc", "no", "yes",
                "this", "that", "used", "based"
            ]
            const groupedByYear = {}
            const tokenizer = new natural.WordTokenizer()
    
            data.forEach(item => {
                const year = item.publication_date.split('-')[0];
                if (!groupedByYear[year]) {
                    groupedByYear[year] = []
                }
                const texts = item.abstract
                const tokens = tokenizer.tokenize(texts)
    
                tokens.forEach(token => {
                    const word = token.toLowerCase()
                    if (!stopWords.includes(word) && !groupedByYear[year].includes(word)) {
                        groupedByYear[year].push(word)
                    }
                })
            })
    
            let year
            const wordCountMap = {}
            const resultMetrics = []
            for (const yearKey of Object.keys(groupedByYear)) {
                year = yearKey
                groupedByYear[year].forEach((word) => {
                    if (!wordCountMap[word]) {
                        wordCountMap[word] = 1
                    } else {
                        wordCountMap[word]++
                    }
                })
    
                const sortedWords = Object.keys(wordCountMap).sort(
                    (a, b) => wordCountMap[b] - wordCountMap[a]
                )
    
                const topWords = sortedWords.slice(0, 15);
                resultMetrics.push({ [year]: topWords })
            }
    
            return res.status(200).json(resultMetrics)
        }catch(error){
            return res.status(500).json(`Internal server error! ${error.message}`)
        }
    };
    return{
        postMetricsPapersAws,
        postMetricsPapersGoogle,
        postMetricsPapersAzure,
        postMetricsPapersLocal
    }
}