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
        Box
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const SearchDatabaseForm = (props)=> {
  const [control, setControl] = useState(true)
  const navigate = useNavigate()
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      name:null,
      credentials:null,
  })
  const getData = () =>{
    api.get(`searchdatabase/${id}`).then(res=>{
        res.data.credentials = (res.data.credentials) ? JSON.stringify(res.data.credentials) : null 
        setData(res.data)
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  useEffect(() => {
    if (id){
        getData()
    }
  },[control]); 
  
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name required').max(255, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            name:data.name,
            credentials: JSON.parse(data.credentials)
        }
        if(data.id){
            api.put(`searchdatabase/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Search Database updated!")
                navigate('/dashboard/searchdatabase', { replace: true })
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        } else {
            api.post(`searchdatabase`,payload).then(res=>{
                props.showMessageSuccess("Search Database created!")
                navigate('/dashboard/searchdatabase')
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Search Database | Tasi Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Search Database
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
                                        autoComplete="name"
                                        type="string"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="credentials"
                                        type="text"
                                        label="Credentials"
                                        {...getFieldProps('credentials')}
                                        error={Boolean(touched.credentials && errors.credentials)}
                                        helperText={touched.credentials && errors.credentials}
                                    />
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
export default withSnackbar(SearchDatabaseForm)