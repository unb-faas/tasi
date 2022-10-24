const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_search_execution as a'
const defaultFields = [
    'a.id',
    'a.id_search',
    'a.date',
    'a.total_chunks',
    'a.status',
 ]
 .concat(conn.raw("(select count(*) from tb_search_result as b where id_search_execution = a.id and b.status->>'text' = 'Finished') as chunks_finished "))
 .concat(conn.raw("( WITH papers AS ( SELECT json_array_length(content->'papers') as cPapers FROM tb_search_result where id_search_execution=a.id) SELECT sum(cPapers)  FROM papers) as papers_found"))

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
    
    /* Filtering */
    if(queryParams.filterSearch) {
        query = query.andWhereRaw(" a.id_search = ?", [queryParams.filterSearch])                        
    }
    
    /* Counting */
    let total = await query.clone().count();
    
    if(!total) {
        total = 0;
    } else {
        total = parseInt(total.shift().count)
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

const remove = async (id) => {
    await conn('tb_search_result')
        .where('id_search_execution',"=",id)
        .del()
    return conn(table)
        .where('id',"=",id)
        .del()
}

exports.getById = getById
exports.getPage = getPage
exports.create = create
exports.update = update
exports.remove = remove