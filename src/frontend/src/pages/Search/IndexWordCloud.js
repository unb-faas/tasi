import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef , createRef} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
import saveFilled from '@iconify/icons-ant-design/save-filled';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { saveSvgAsPng } from 'save-svg-as-png';

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
  TextField,
  TableBody,
  Divider,
  TableCell,
  InputLabel,
  Select,
  MenuItem,
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
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const Searchs = (props) => {
  const wordcloudRef = createRef();
  const {idExec} = useParams();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('search-wordcloud-order') ? localStorage.getItem('search-wordcloud-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('search-wordcloud-order-by') ? localStorage.getItem('search-wordcloud-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('search-wordcloud-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('search-wordcloud-rows-per-page') ? localStorage.getItem('search-wordcloud-rows-per-page') : 99999999);
  const [DATALIST, setDATALIST] = useState(null);
  const [total, setTotal] = useState(null);
  const [attribute, setAttribute] = useState('title');
  const [words, setWords] = useState(200);
  const [weight, setWeight] = useState(50);

  const getData = (page,rowsPerPage,orderBy,order,filterName, words, weight) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order,provider_active:1,"filterName":filterName}
    api.list(`search/${idExec}/results?wordcloud=true&words=${words}&weight=${weight}&attribute=${attribute}`,'backend',params).then(res=>{
      const searchList = res.data.data
      if (searchList){
        setDATALIST(searchList)
        setTotal(res.data.total)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const handleSave = () => {
    const svgElement = wordcloudRef.current.querySelector('svg');
    saveSvgAsPng(svgElement, 'wordcloud.png');
  };

  const handleChangeWords = (e) => {
    setWords(e.target.value)
    setDATALIST(null)
    setControl(!control)
  }

  const handleChangeWeight = (e) => {
    setWeight(e.target.value)
    setDATALIST(null)
    setControl(!control)
  }

  const handleChangeAttribute = (e) => {
    setAttribute(e.target.value)
    setDATALIST(null)
    setControl(!control)
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName, words, weight)
    // const interval=setInterval(getData, 5000, page, rowsPerPage, orderBy, order,filterName)
    // return()=>clearInterval(interval)
  },[control]); 

  
  return (
    <Page title="Search Word Cloud | Tasi Framework" >
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Word Cloud
          </Typography>
        </Stack>
        <Card>
            {DATALIST === null && 
            <Grid container justifyContent="center" alignItems="center">
              <Box m={10}>
                <CircularProgress />
              </Box>
            </Grid>
            }
            {DATALIST &&
                <fragment>
                    <Box p={3}>
                      <Grid container>
                        <Grid item xs={3}>
                          <TextField
                            select
                            value={attribute}
                            label="Attribute"
                            onChange={handleChangeAttribute}
                          >
                            <MenuItem value="abstract">abstract</MenuItem>
                            <MenuItem value="author">author</MenuItem>
                            <MenuItem value="keyword">keyword</MenuItem>
                            <MenuItem value="title">title</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField 
                              label="Words" 
                              variant="outlined" 
                              value={words}
                              onChange={handleChangeWords}
                          />    
                        </Grid>
                        <Grid item xs={4}>
                          <TextField 
                              label="Weight" 
                              variant="outlined" 
                              value={weight}
                              onChange={handleChangeWeight}
                          />    
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                              onClick={handleSave}
                              variant="contained"
                              color="secondary"
                              startIcon={<Icon icon={saveFilled} />}
                          >
                              Save as Image
                          </Button>
                        </Grid>
                      </Grid>
                        
                        
                        
                    </Box>
                    <Divider />
                    <span ref={wordcloudRef}>
                        <WordCloud spiral="archimedean" data={DATALIST} />
                    </span>
                </fragment>
            }
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
