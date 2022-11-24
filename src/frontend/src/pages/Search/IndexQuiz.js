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
  MenuItem,
  TableBody,
  Divider,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  LinearProgress,
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
import AnswersChart  from './charts/Answers';

// ----------------------------------------------------------------------

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 55 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}% answered`}</Typography>
      </Box>
    </Box>
  );
}

const Searchs = (props) => {
  const {id, idExec} = useParams();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('search-quiz-order') ? localStorage.getItem('search-quiz-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('search-quiz-order-by') ? localStorage.getItem('search-quiz-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('search-quiz-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('search-quiz-rows-per-page') ? localStorage.getItem('search-quiz-rows-per-page') : 999999);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});

  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order}
    api.list(`searchquestion?filterSearch=${id}`,'backend',params).then(res=>{
      setQuestions(res.data.data)
      res.data.data.map(async question => {
        const res = await api.list(`search/${idExec}/results?quiz=true&id_question=${question.id}`,'backend',params)
        const qid = question.id
        const tmp = answers
        tmp[qid] = res.data
        setAnswers({...answers, tmp})
        console.log(answers)
        return question
      });
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
  },[control]); 
  
  return (
    <Page title="Search Quiz | Tasi Framework" >
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quiz
          </Typography>
        </Stack>
        <Card>
          <Grid container >
           {questions === null && 
              <Grid container justifyContent="center" alignItems="center">
                <Box m={10}>
                  <CircularProgress />
                </Box>
              </Grid>
            }
            {questions && questions.map(question => (
              <Grid item xs={6}>
                 <Box mt={5} ml={2} mr={2} >
                    <Grid container >
                      <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Grid item xs={3}>                     
                            <Typography variant="h6">{question.description}</Typography>
                        </Grid>
                      </Grid>
                      {answers && answers[question.id] && (
                        <Grid item xs={12}>
                          <LinearProgressWithLabel value={answers[question.id].answered / answers[question.id].total * 100} /> 
                        </Grid>
                      )}                      
                      <Grid item xs={12}>
                        <Divider />
                      </Grid> 
                      <Grid item xs={12}>
                        {answers && answers[question.id] && (
                           <AnswersChart key={question.id} DATALIST={answers[question.id]} />
                        )}
                      </Grid> 
                    </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
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
