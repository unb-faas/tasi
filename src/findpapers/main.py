from typing import Union
import os
import json
from fastapi import FastAPI, HTTPException
from random import seed
from random import random
from pydantic import BaseModel
import timeout_decorator

class Item(BaseModel):
    query: str
    tokens: dict = None
    databases: str = "acm,ieee,scopus"
    limit: int = 9999
    since: str = None
    until: str = None

app = FastAPI()

@timeout_decorator.timeout(5)
@app.post("/search")
async def read_search(item: Item):
    #QUERY="[serverless] OR [function-as-a-service] OR [function as a service] OR [backend-as-a-service] OR [backend as a service] OR [aws lambda] OR [google gloud platform] OR [azure functions]"
    #print(query) 
    if item.query == "":
        raise HTTPException(status_code = 500, detail=  "Query parameter is required")

    if item.databases == "":
        raise HTTPException(status_code = 500, detail=  "Database parameter is required")


    seed(1)
    id = random()
    file = 'search_results' + str(id) + '.json'
    cmd = 'findpapers search '+file + ' --databases ' + item.databases + ' --limit ' + str(item.limit) + ' -q "' + item.query + '"'
    
    if item.since:
        cmd = cmd + ' --since ' + item.since
    
    if item.until:
        cmd = cmd + ' --until ' + item.until

    if item.tokens and item.tokens["list"]:
        for token in item.tokens["list"]:
            print(token)
            cmd = cmd + ' --'+ token["name"] + ' ' + token["value"]    
    
    print(cmd)
    stream = os.popen(cmd)
    output = stream.read()
    f = open(file, "r")
    data = json.load(f)
    os.remove(file)
    return data