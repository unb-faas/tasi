import axios from "axios"

const urls = {
  backend: process.env.REACT_APP_BACKEND_URL,
  findpapers: process.env.REACT_APP_FINDPAPERS_URL,
}

const backend = axios.create({
  baseURL: urls.backend
});

const findpapers = axios.create({
  baseURL: urls.findpapers
});

const list = async (object, api = 'backend', params) => {
  const axiosOptions = {
    method: 'GET',
    url: object,
    params
  };
  
  switch (api) {
    case "backend":
      return backend(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

const get = async (object,api="backend") => {
  
  const axiosOptions = {
    method: 'GET',
    url: object
  };
  
  switch (api) {
    case "backend":
      return backend(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

const post = async (object, dt , api="backend") => {
  
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
      return findpapers(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

const put = async (object, dt , api="backend") => {
  
  const axiosOptions = {
    method: 'PUT',
    data: dt,
    url: object
  };
  
  switch (api) {
    case "backend":
      return backend(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

const remove = async (object,api="backend") => {
  
  const axiosOptions = {
    method: 'DELETE',
    url: object
  };
  
  switch (api) {
    case "backend":
      return backend(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

export const api = {
  urls,
  list,
  get,
  post,
  put,
  remove
};
