import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
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
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
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
  const {idExec} = useParams();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('search-result-order') ? localStorage.getItem('search-result-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('search-result-order-by') ? localStorage.getItem('search-result-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('search-result-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('search-result-rows-per-page') ? localStorage.getItem('search-result-rows-per-page') : 9999999);
  const [DATALIST, setDATALIST] = useState(null);
  const [total, setTotal] = useState(null);

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

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
    const interval=setInterval(getData, 5000, page, rowsPerPage, orderBy, order,filterName)
    return()=>clearInterval(interval)
  },[control]); 

  
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
                  {DATALIST && DATALIST.length > 0 && DATALIST
                    .map((row) => {
                      const { id, publication_date, title, abstract, doi, authors, number_of_pages} = row;
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
                to="../../../.."
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
