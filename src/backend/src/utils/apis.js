
const axios = require("axios")

const urls = {
  backend:process.env.REACT_APP_BACKEND_URL,
  findpapers:process.env.REACT_APP_FINDPAPERS_URL,
}

const backend = axios.create({
  baseURL: urls.backend,
});

const findpapers = axios.create({
    baseURL: urls.findpapers,
});

module.exports = {
  async get (object,api="findpapers") {

    const axiosOptions = {
      method: 'GET',
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
      case "findpapers":
        return findpapers(axiosOptions)
        .catch(err=>{
          console.log(err)
        })
      default:
        break;
    }
    
  },

  async post (object, dt , api="findpapers") {

    const axiosOptions = {
      method: 'POST',
      data: dt,
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
      case "findpapers":
        return findpapers(axiosOptions)
        // .catch(err=>{
        //   console.log(err)
        // })
      default:
        break;
    }
    
  },

  urls(api){
    switch (api) {
      case "backend":
        return urls.backend
      case "findpapers":
        return urls.findpapers
      default:
        break;
    }
  }
  
};