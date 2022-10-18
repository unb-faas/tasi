import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

// material
import { 
        Stack, 
        TextField, 
        Container,
        Typography,
        Card,
        CardContent,
        MenuItem,
        Button,
        Box,
        InputLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';


// ----------------------------------------------------------------------
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

const SearchForm = (props)=> {
  const [control, setControl] = useState(true)
  const navigate = useNavigate()
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      description:null,
      string: null,
      since:null,
      until:null,
      search_databases:{ids:[]},
  })
  const [searchDatabases, setSearchDatabases] = useState([])
  const [searchDatabasesValue, setSearchDatabasesValue] = useState([])
  const [searchDatabasesIDs, setSearchDatabasesIDs] = useState([])

  const getData = () =>{
    api.get(`search/${id}`).then(res=>{
        setData(res.data, () => buildCheckedSearchDatabase())
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  const getSearchDatabase = () =>{
    api.get(`searchdatabase`).then(res=>{
        setSearchDatabases(res.data.data)    
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }


  const buildCheckedSearchDatabase = () =>{
    const values = []
    const ids = []
    if (data && data.search_databases && data.search_databases.ids){
        data.search_databases.ids.map(i => {
        searchDatabases.map(x => {
            if (x.id === i){
                values.push(x.name)
                ids.push(x.id)
            }
            return x
        })
        return i
        })
    }
    setSearchDatabasesValue(values)
    setSearchDatabasesIDs(ids)
  }



  useEffect(() => {
    getSearchDatabase()
    if (id){
        getData()
    }
  },[control]);
  
  useEffect(() => {
       buildCheckedSearchDatabase()
  },[searchDatabases, data]);
  
  
  const RegisterSchema = Yup.object().shape({
    description: Yup.string().required('Description required').max(255, 'Too Long!'),
    string: Yup.string().required('String required').max(9999, 'Too Long!'),
    since: Yup.date().required('Since required'),
    until: Yup.date().required('Until required'),
    
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            description:data.description,
            string:data.string,
            since:data.since,
            until:data.until,
            search_databases:{ids:searchDatabasesIDs}
        }
        if(data.id){
            api.put(`search/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Search updated!")
                navigate('/dashboard/search', { replace: true })
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        } else {
            api.post(`search`,payload).then(res=>{
                props.showMessageSuccess("Search created!")
                navigate('/dashboard/search')
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearchDatabasesValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );


    const ids = []
    const val = typeof value === 'string' ? value.split(',') : value
    val.map(database=>{
        searchDatabases.map(x => {
            if (x.name === database){
                ids.push(x.id)
            }
            return x
        })
        return database
    })
    setSearchDatabasesIDs(ids);
  };


  return (
    <Page title="Form Search | Tasi Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Search
                </Typography>
            </Stack>
            <Card>
                <CardContent>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Stack spacing={3}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="description"
                                        type="string"
                                        label="Description"
                                        {...getFieldProps('description')}
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                    />
                                </Stack>

                                <Stack spacing={3}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="string"
                                        type="string"
                                        label="String"
                                        {...getFieldProps('string')}
                                        error={Boolean(touched.string && errors.string)}
                                        helperText={touched.string && errors.string}
                                    />
                                </Stack>

                                <Stack spacing={3}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            InputLabelProps={{ shrink: true }} 
                                            label="Since"
                                            {...getFieldProps('since')}
                                            onChange ={(value) => formik.setFieldValue("since", value)}
                                            error={Boolean(touched.since && errors.since)}
                                            helperText={touched.since && errors.since}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            InputLabelProps={{ shrink: true }} 
                                            label="Until"
                                            {...getFieldProps('until')}
                                            onChange ={(value) => formik.setFieldValue("until", value)}
                                            error={Boolean(touched.until && errors.until)}
                                            helperText={touched.until && errors.until}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <InputLabel id="select-db">Databases</InputLabel>
                                    <Select
                                        labelId="select-db"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        label="Databases"
                                        value={searchDatabasesValue}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Tag" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        >
                                        {searchDatabases.length && searchDatabases.map((searchDatabase) => (
                                            <MenuItem key={searchDatabase.id} value={searchDatabase.name}>
                                                <Checkbox checked={searchDatabasesValue.indexOf(searchDatabase.name) > -1} />
                                                <ListItemText primary={searchDatabase.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </Stack>

                                
                               
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                
                                            
                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                    >
                                        Save
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </CardContent>
            </Card>
            <Box mt={3}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to=".."
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
export default withSnackbar(SearchForm)