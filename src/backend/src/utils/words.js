const daoWordReplace = require('../dao/WordReplaceDAO')
const daoWordFilter = require('../dao/WordFilterDAO')

module.exports = {
  async frequency (papers, maxWords, weight) {
    console.log(papers)
    const replaces = await daoWordReplace.getPage({size:999999})
    let words = ""
    for (let i in papers){
        const paper = papers[i]
        let abstract = paper.abstract ? paper.abstract.toLowerCase().replace(/\./g, '').replace(/,/g, '') : ""
        for (let i in replaces.data){
            const change = replaces.data[i]
            const re = new RegExp(change.target.toLowerCase(),"g")
            abstract = abstract.replace(re,change.replace.toLowerCase())
        }
        words += abstract
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
            frequencyFormated.push(
                {
                    text: freq[0],
                    value: freq[1]*weight
                }
            )
    }
    return {data:frequencyFormated, total:frequencyFormated.length}
  },
  
};