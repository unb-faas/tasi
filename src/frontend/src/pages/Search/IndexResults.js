import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';

// material
import {
  Card,
  Table,
  Stack,
  Box,
  Chip,
  Grid,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Divider,
  TextField,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Menu, MenuItem, IconButton, ListItemIcon, ListItemText,
  Link as Links,
  Tooltip
} from '@material-ui/core';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';




// ----------------------------------------------------------------------

const Searchs = (props) => {
  const {id, idExec} = useParams();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('search-result-order') ? localStorage.getItem('search-result-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('search-result-order-by') ? localStorage.getItem('search-result-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('search-result-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('search-result-rows-per-page') ? localStorage.getItem('search-result-rows-per-page') : 9999999);
  const [DATALIST, setDATALIST] = useState(null);
  const [total, setTotal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})

  const getQuestions = () => {
    const params = {page:0,size:9999,"orderBy":"id","order":"asc","filterSearch":id}
    api.list(`searchquestion`,'backend',params).then(res=>{
      const questionList = res.data.data
      if (questionList){
        setQuestions(questionList)
        questionList.forEach(element => {
          getAnswers(element.id)
        });
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const getAnswers = (idQuestion) => {
    const params = {page:0,size:9999,"orderBy":"id","order":"asc","filterSearchQuestion":idQuestion}
    api.list(`searchquestionanswer`,'backend',params).then(res=>{
      const answerList = res.data.data
      if (answerList){
        answers[idQuestion] = answerList
        setAnswers(answers)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }


  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order,provider_active:1,"filterName":filterName}
    api.list(`search/${idExec}/results`,'backend',params).then(res=>{
      const searchList = res.data.data
      if (searchList){
        setDATALIST(searchList)
        setTotal(res.data.total)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const getCategories = () =>{
    const params = {page:0,size:99999,"orderBy":"name","order":"asc"}
    api.list(`category`,'backend',params).then(res=>{
      const categories = res.data.data
      if (categories){
        setCategories(categories)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const remove = (id_search_result, id) => {
    api.remove(`searchresult/${id_search_result}/${id}`,'backend').then(res=>{
      props.showMessageSuccess('Paper removed from results')
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
    getCategories()
    getQuestions()
    const interval=setInterval(getData, 5000, page, rowsPerPage, orderBy, order,filterName)
    return()=>clearInterval(interval)
  },[control]); 

  const handleChangeMultiple = (event,id_search_result,id) => {
    api.put(`searchresult/${id_search_result}/${id}?selected=${event.target.value.join(',')}`,'backend').then(res=>{
        setControl(!control)
      }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
    };

    const handleChangeAnswer = (event,id_search_result,id, id_question) => {
      api.put(`searchresult/${id_search_result}/${id}?id_answer=${event.target.value}&id_question=${id_question}`,'backend').then(res=>{
          setControl(!control)
        }).catch(e=>{
          props.showMessageError(`Request failed ${e}`)
        })
      };



  
  return (
    <Page title="Search Executions | Tasi Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search Results ({total} papers)
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
                  <div> 
                  {DATALIST === null && 
                  <Grid container justifyContent="center" alignItems="center">
                    <Box m={10}>
                      <CircularProgress />
                    </Box>
                  </Grid>
                  }
                  {DATALIST && DATALIST.length > 0 && DATALIST
                    .map((row) => {
                      const { id, id_search_result, publication_date, title, abstract, doi, authors, number_of_pages, publication} = row;
                      let { selected_categories, selected_answers} = row;
                      if (!selected_categories){
                        selected_categories = []
                      }
                      if (!selected_answers){
                        selected_answers = []
                      }
                      return (
                                <Accordion>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                      <Typography variant="headline6">{title}</Typography>
                                      
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box pb={5}>
                                            <Grid container>
                                                <Grid item xs={1}>
                                                    <MenuItem sx={{ color: 'text.primary' }} onClick={(event)=>{remove(id_search_result, id)}}>
                                                        <ListItemIcon >
                                                            <Tooltip title="Remove from results">
                                                            <Icon icon={trash2Outline} width={24} height={24} />
                                                            </Tooltip>
                                                        </ListItemIcon>
                                                    </MenuItem>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        style={{width:'200px'}}
                                                        select
                                                        name="categories"
                                                        variant="outlined"
                                                        label="categories"
                                                        SelectProps={{
                                                            multiple: true,
                                                            value: selected_categories,
                                                            onChange:(event)=>{handleChangeMultiple(event, id_search_result, id)} 
                                                        }}
                                                    >
                                                        <MenuItem value="">-</MenuItem>
                                                        {categories && categories.map((category) => 
                                                                <MenuItem value={category.id}>{category.name}</MenuItem>
                                                        )
                                                        }
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={5}>
                                                  {typeof questions !== "undefined" && questions.map(q => (
                                                    <Grid container>
                                                      <Grid item xs={12}>
                                                        <Typography variant="overline">{q.description}</Typography>
                                                      </Grid>
                                                      <Grid item xs={12}>
                                                        <TextField
                                                            style={{width:'200px'}}
                                                            select
                                                            name="answers"
                                                            variant="outlined"
                                                            label="answer"
                                                            SelectProps={{
                                                                value: selected_answers[q.id],
                                                                onChange:(event)=>{handleChangeAnswer(event, id_search_result, id, q.id)} 
                                                            }}
                                                        >
                                                            <MenuItem value="">-</MenuItem>
                                                            {answers && answers[q.id] && answers[q.id].map((answer) => 
                                                                    <MenuItem value={answer.id}>{answer.description}</MenuItem>
                                                            )
                                                            }
                                                        </TextField>
                                                      </Grid>
                                                    </Grid>
                                                  ))}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        
                                        <Divider />
                                        <Typography style={{fontWeight: 'bold'}} variant="overline">Date:</Typography> 
                                        
                                        <Typography>{publication_date}</Typography>
                                        
                                        <Typography style={{fontWeight: 'bold'}} variant="overline">Abstract:</Typography> 
                                        
                                        <Typography>{abstract}</Typography>
                                        
                                        <Typography style={{fontWeight: 'bold'}} variant="overline">DOI:</Typography> 
                                        
                                        <Typography>{doi}</Typography>
                                        
                                        <Typography style={{fontWeight: 'bold'}} variant="overline">Authors:</Typography> 
                                        
                                        <Typography>{authors.join(', ')}</Typography>

                                        <Typography style={{fontWeight: 'bold'}} variant="overline">Pages:</Typography> 
                                        
                                        <Typography>{number_of_pages}</Typography>

                                        <Typography style={{fontWeight: 'bold'}} variant="overline">Publication Type:</Typography> 
                                        
                                        <Typography>{publication && publication.category}</Typography>
                                          
                                    </AccordionDetails>
                                
                                </Accordion>


                        
                      );
                    })}
                    </div>
          </Scrollbar>
        </Card>
        <Box mt={3}>
          <Button
                variant="contained"
                component={RouterLink}
                to={`../../../../${id}/executions`}
                color="info"
                startIcon={<Icon icon={arrowBackOutline} />}
            >
                Back
            </Button>
        </Box>
      </Container>

    </Page>
  );
}

export default withSnackbar(Searchs)
