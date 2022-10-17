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

const WordFilterForm = (props)=> {
  const [control, setControl] = useState(true)
  const navigate = useNavigate()
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      word:null,
  })
  const getData = () =>{
    api.get(`wordfilter/${id}`).then(res=>{
        res.data.urls = (res.data.urls) ? JSON.stringify(res.data.urls) : null 
        res.data.parameters = (res.data.parameters) ? JSON.stringify(res.data.parameters) : null 
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
    word: Yup.string().required('Word required').max(255, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            word:data.word,
        }
        if(data.id){
            api.put(`wordfilter/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Word Filter updated!")
                navigate('/dashboard/wordfilter', { replace: true })
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        } else {
            api.post(`wordfilter`,payload).then(res=>{
                props.showMessageSuccess("Word Filter created!")
                navigate('/dashboard/wordfilter')
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Word Filter | Tasi Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Word Filter
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
                                        autoComplete="word"
                                        type="string"
                                        label="Word"
                                        {...getFieldProps('word')}
                                        error={Boolean(touched.word && errors.word)}
                                        helperText={touched.word && errors.word}
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
export default withSnackbar(WordFilterForm)