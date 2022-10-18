import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink } from 'react-router-dom';
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
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { SearchDatabaseListHead, SearchDatabaseListToolbar, SearchDatabaseMoreMenu } from '../../components/_dashboard/searchdatabase';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
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

const SearchDatabases = (props) => {
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('searchdatabase-order') ? localStorage.getItem('searchdatabase-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('searchdatabase-order-by') ? localStorage.getItem('searchdatabase-order-by') : 'name');
  const [filterName, setFilterName] = useState(localStorage.getItem('searchdatabase-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('searchdatabase-rows-per-page') ? localStorage.getItem('searchdatabase-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [total, setTotal] = useState(0);

  


  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('searchdatabase-order', isAsc ? 'desc' : 'asc');
    localStorage.setItem('searchdatabase-order-by', property);
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
    api.list('searchdatabase','backend',params).then(res=>{
      const searchdatabaseList = res.data.data
      if (searchdatabaseList){
        searchdatabaseList.forEach(searchdatabase=>{
          api.list(`status/${searchdatabase.id}/${searchdatabase.acronym}`,'orchestrator').then(res=>{
            if (res && res.data){
              const status = res.data
              const new_statuses = statuses
              new_statuses[searchdatabase.id] = status
              setStatuses({...statuses,new_statuses})
            }
          })
        })
        setDATALIST(searchdatabaseList)
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
    localStorage.setItem('searchdatabase-page', event.target.value);
    setPage(newPage);
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem('searchdatabase-rows-per-page', parseInt(event.target.value,10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const handleFilterByName = (event) => {
    localStorage.setItem('searchdatabase-search', event.target.value);
    setFilterName(event.target.value);
    setPage(0);
    setControl(!control)
  };

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
    <Page title="Search Databases | Tasi Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search Databases
          </Typography>

          <Button
            variant="contained"
            component={RouterLink}
            to="create"
            startIcon={<Icon icon={plusFill} />}
          >
            New Database
          </Button>
        </Stack>

        <Card>
          <SearchDatabaseListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            getData={getData}
            selected={selected}
            setSelected={setSelected}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SearchDatabaseListHead
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
                      const { id, name} = row;
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
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="right">
                            <SearchDatabaseMoreMenu props={props} row={row} getData={getData} />
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
      </Container>

    </Page>
  );
}

export default withSnackbar(SearchDatabases)
