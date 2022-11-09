const daoWordReplace = require('../dao/WordReplaceDAO')
const daoWordFilter = require('../dao/WordFilterDAO')

module.exports = {
  async frequency (papers, attribute, maxWords, weight) {
    const replaces = await daoWordReplace.getPage({size:999999})
    let words = ""
    for (let i in papers){
        const paper = papers[i]
        let content = ""
        switch (attribute) {
            case "abstract":
                content = paper.abstract ? paper.abstract : ""
                break;
            case "title":
                content = paper.title ? paper.title : ""
                break;
            case "keyword":
                for (let x in paper.keywords){
                    content += paper.keywords[x] ? paper.keywords[x]+" " : ""
                }
                break;
            case "author":
                for (let x in paper.authors){
                    content += paper.authors[x] ? paper.authors[x].replace(/ /g, '_')+" " : ""
                }
                break;
                
            default:
                break;
        }

        content = content.toLowerCase().replace(/\./g, '').replace(/,/g, '').replace(/  /g, ' ')

        for (let i in replaces.data){
            const change = replaces.data[i]
            const re = new RegExp(change.target.toLowerCase(),"g")
            content = content.replace(re,change.replace.toLowerCase())
        }
        words += content
    }
    
    words = words.split(" ")

    const filters = await daoWordFilter.getPage({size:999999})
    for (let i in filters.data){
        const filter = filters.data[i]
        const temp = words.filter(element => ![filter.word].includes(element))
        words = temp
    }

    const frequency = words.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    let frequencyList = [...frequency.entries()]
    frequencyList = frequencyList.sort((a, b)=>{
        if (a[1] > b[1]) {
            return -1;
            }
            if (a[1] < b[1]) {
            return 1;
            }
            return 0;
    })

    frequencyList = frequencyList.slice(0,maxWords)
    const frequencyFormated = []
    for (let i in frequencyList){
        const freq = frequencyList[i]
        if (freq[0]!=="" && freq[0]!=="-"){
            frequencyFormated.push(
                {
                    text: freq[0],
                    value: freq[1]*weight
                }
            )
        }
    }
    return {data:frequencyFormated, total:frequencyFormated.length}
  },
  
};