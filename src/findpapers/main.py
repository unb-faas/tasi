from typing import Union
import os
from fastapi import FastAPI
from random import seed
from random import random
import json

app = FastAPI()


@app.get("/search")
def read_search(token_ieee: str, token_scopus: str, query: str, databases: str = "acm,ieee,scopus", limit: int = 9999):
    #QUERY="[serverless] OR [function-as-a-service] OR [function as a service] OR [backend-as-a-service] OR [backend as a service] OR [aws lambda] OR [google gloud platform] OR [azure functions]"
    #print(query) 
    seed(1)
    id = random()
    file = 'search_results' + str(id) + '.json'
    stream = os.popen('findpapers search '+file+' --token-ieee '+ token_ieee + ' --token-scopus ' + token_scopus + ' --databases ' + databases + ' --limit ' + str(limit) + ' -q "' + query + '"')
    output = stream.read()
    f = open(file, "r")
    data = json.load(f)
    return data


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}