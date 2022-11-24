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

const SearchQuestionAnswerForm = (props)=> {
  const [control, setControl] = useState(true)
  const navigate = useNavigate()
  const {id, id_question, id_answer} = useParams()
  const operation = (id_answer) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      description:null,
      id_search_question:id_question,
  })
  const getData = () =>{
    api.get(`searchquestionanswer/${id_answer}`).then(res=>{
        setData(res.data)
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  useEffect(() => {
    if (id_answer){
        getData()
    }
  },[control]); 
  
  const RegisterSchema = Yup.object().shape({
    description: Yup.string().required('Description required').max(500, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            description:data.description,
            id_search_question:data.id_search_question,
        }
        if(data.id){
            api.put(`searchquestionanswer/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Answer updated!")
                navigate(`/dashboard/search/${id}/questions/${id_question}/answers`, { replace: true })
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        } else {
            api.post(`searchquestionanswer`,payload).then(res=>{
                props.showMessageSuccess("Answer created!")
                navigate(`/dashboard/search/${id}/questions/${id_question}/answers`)
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Answer | Tasi Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Answer
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
export default withSnackbar(SearchQuestionAnswerForm)