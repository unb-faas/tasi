import { filter, result } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
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
  Tooltip,
  Menu, MenuItem, IconButton, ListItemIcon, ListItemText
} from '@material-ui/core';

// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { SearchListHead, SearchListToolbarSearchResult, SearchMoreMenu } from '../../components/_dashboard/search';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'created_at', label: 'Created at', alignRight: false },
  { id: 'chunk', label: 'Chunk', alignRight: false },
  { id: 'database', label: 'Database', alignRight: false },
  { id: 'since', label: 'Since', alignRight: false },
  { id: 'until', label: 'Until', alignRight: false },
  { id: 'papers_found', label: 'Papers Found', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const Searchs = (props) => {
  const {idExec} = useParams()

  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('search-chunk-order') ? localStorage.getItem('search-chunk-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('search-chunk-order-by') ? localStorage.getItem('search-chunk-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('search-chunk-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('search-chunk-rows-per-page') ? localStorage.getItem('search-chunk-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [total, setTotal] = useState(0);

  
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('search-chunk-order', isAsc ? 'desc' : 'asc');
    localStorage.setItem('search-chunk-order-by', property);
    setControl(!control)
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DATALIST.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order,provider_active:1,"filterName":filterName}
    api.list(`searchresult?filterSearchExecution=${idExec}` ,'backend',params).then(res=>{
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    localStorage.setItem('search-chunk-page', event.target.value);
    setPage(newPage);
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem('search-chunk-rows-per-page', parseInt(event.target.value,10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const handleFilterByName = (event) => {
    localStorage.setItem('search-chunk-search', event.target.value);
    setFilterName(event.target.value);
    setPage(0);
    setControl(!control)
  };

  const replay = async (ids) =>{
    ids.forEach( id => {
        api.get(`searchresult/${id}/replay`,"backend").then(res => {
            props.showMessageSuccess("The search replay was requested!")
          })
    });
    
  }
    
  

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height:'90%',
    bgcolor: 'black',
    color: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    overflow: 'scroll',
    p: 4,
  };
  return (
    <Page title="Searches Result Chunks | Tasi Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Searches Result Chunks
          </Typography>
        </Stack>

        <Card>
          <SearchListToolbarSearchResult
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            getData={getData}
            selected={selected}
            setSelected={setSelected}
            replay={replay}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SearchListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DATALIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {DATALIST.length > 0 && DATALIST
                    .map((row) => {
                      const { id,  date, status, chunk, since, until, database, content } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
                      
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{new Date(date).toLocaleDateString()}</TableCell>
                          
                          <TableCell align="left">{chunk}</TableCell>
                          <TableCell align="left">{database}</TableCell>
                          <TableCell align="left">{new Date(since).toLocaleDateString()}</TableCell>
                          <TableCell align="left">{new Date(until).toLocaleDateString()}</TableCell>
                          <TableCell align="left">{(content && content.papers.length) ? content.papers.length : 0}</TableCell>
                          <TableCell align="left">{status.text}</TableCell>
                          <TableCell align="right">
                            {(status.text === "Error") && 
                            <MenuItem onClick={(event)=>{replay([id])}} sx={{ color: 'text.primary' }}>
                                <ListItemIcon>
                                  <Icon icon={refreshFill} width={24} height={24} />
                                </ListItemIcon>
                                <ListItemText primary="" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}
                </TableBody>
                {!DATALIST.length > 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Box mt={3}>
          <Button
                variant="contained"
                component={RouterLink}
                to="../.."
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
