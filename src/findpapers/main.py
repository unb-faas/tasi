from typing import Union
import os
import json
from fastapi import FastAPI, HTTPException
from random import seed
import random
from pydantic import BaseModel
import timeout_decorator
from typing import List
import string
from datetime import datetime
import re
from fastapi.middleware.cors import CORSMiddleware

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

class Item(BaseModel):
    query: str
    tokens: dict = None
    databases: str = "acm,ieee,scopus"
    limit: int = 9999
    since: str = None
    until: str = None

class Paper(BaseModel):
    databases: list
    keywords: list
    urls: list
    publication_date: str
    #selected: str
    title: str
    tokens: list = []

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#@timeout_decorator.timeout(5)
@app.post("/download")
async def download(paper: Paper):
    newpath = get_random_string(10)
    if not os.path.exists("/papers/"+newpath):
        os.makedirs("/papers/"+newpath)
    obj = {
        "papers":[{
            "databases": paper.databases,
            "keywords": paper.keywords,
            "urls": paper.urls,
            "publication_date":paper.publication_date,
            "selected":"true",
            "title":paper.title,
        }]}
    with open("/papers/"+newpath+"/search.json", "w") as outfile:
        json.dump(obj, outfile)
    cmd = "findpapers download /papers/"+newpath+"/search.json /papers/"+newpath+" -s"
    #if paper.tokens:
    #    for token in paper.tokens:
    #        print(token)
    #        cmd = cmd + ' --'+ token["name"] + ' ' + token["value"]    
    
    stream = os.popen(cmd)
    date = datetime.strptime(paper.publication_date, '%Y-%m-%d')
    output_filename = f'{date.year}-{paper.title}'
    output_filename = re.sub(
        r'[^\w\d-]', '_', output_filename)  # sanitize filename
    output_filename += '.pdf'
    return {"file":newpath+"/"+output_filename}


@timeout_decorator.timeout(5)
@app.post("/search")
async def read_search(item: Item):
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
            cmd = cmd + ' --'+ token["name"] + ' ' + token["value"]        
    stream = os.popen(cmd)
    output = stream.read()
    f = open(file, "r")
    data = json.load(f)
    os.remove(file)
    return data