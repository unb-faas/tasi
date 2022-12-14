const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_search_result as a'
const defaultFields = [
    'a.id',
    'a.id_search_execution',
    'a.date',
    'a.query',
    'a.since',
    'a.until',
    'a.database',
    'a.chunk',
    'a.status',
    'a.content',
 ]
 
 

const getById = async (id) => {
    /* Querying */
    let query = conn(table)
 
    /* Filtering */
    query = query
            .select(defaultFields)
            .andWhere('a.id', '=', id);
    let result = await query;
    if(result.length <= 0)
        return {};
    return result[0];
}

const getPage = async (queryParams) => {
    let pagination = paginationUtils.extractPagination(queryParams);  
    let result = {
        total: 0,
        count: 0,
        data: []
    };


    /* Querying */
    let query = conn(table)
    //query = query.joinRaw("join json_array_elements(content->'papers') as j on (j->'publication'->>'category' != 'Conference Proceedings')")
    //query = query.andWhereRaw("a.id in (WITH papers AS ( SELECT id, json_array_elements(content->'papers') as cPapers FROM tb_search_result where id = a.id ) SELECT distinct id FROM papers where id = a.id and cpapers->'publication'->>'category' != 'Conference Proceedings' and cpapers->'publication'->>'category' != 'Book')")     

    /* Filtering */
    if(queryParams.filterSearchExecution) {
        query = query.andWhereRaw(" a.id_search_execution = ?", [queryParams.filterSearchExecution])                        
    }


    /* Counting */
    let total = await query.clone().count();
    if(!total) {
        total = 0;
    } else {
        total = parseInt(total[0].count)
    }

    /* Ordering */
    if(queryParams.orderBy && queryParams.order) {
        let orderBy =  queryParams.orderBy
        query = query.orderBy(queryParams.orderBy, queryParams.order);
    }
    pagination.sort.forEach(function (value) {
        query = query.orderBy(value.column, value.order);
    });     
    // It always must have a default ordering after all others, 
    // otherwise the listed elements may have unpredictable orders
    query = query.orderBy('a.id', 'asc');

    /* Pagination */
    query = query
                .select(defaultFields)
                .distinctOn('id')
                .offset(pagination.page * pagination.size)
                .limit(pagination.size);
                 
    /* Executing */
    let data = await query.catch(err =>{return {error:err}});
    result.data = data;
    result.count = data.length;    
    result.total = total;

    return result;
}

const create = (params) => {
    return conn(table)
        .returning('id')
        .insert(params)
}

const update = (id,params) => {
    return conn(table)
        .where('id',"=",id)
        .update(params)
}

const remove = (id) => {
    return conn(table)
        .where('id',"=",id)
        .del()
}

exports.getById = getById
exports.getPage = getPage
exports.create = create
exports.update = update
exports.remove = remove