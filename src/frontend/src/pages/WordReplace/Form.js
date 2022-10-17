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

const WordreplaceForm = (props)=> {
  const navigate = useNavigate();
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      target:null,
      replace:null,
  })

  const getData = () =>{
    api.get(`wordreplace/${id}`).then(res=>{
        setData(res.data)
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  useEffect(() => {
    if (id){
        getData()
    }
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    target: Yup.string().required('Target required').max(255, 'Too Long!'),
    replace: Yup.string().required('Replace required').max(255, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            target:data.target,
            replace:data.replace        }
        if(data.id){
            api.put(`wordreplace/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Wordreplace updated!")
                navigate('/dashboard/wordreplace', { replace: true })
            })
        } else {
            api.post(`wordreplace`,payload).then(res=>{
                props.showMessageSuccess("Wordreplace created!")
                navigate('/dashboard/wordreplace')
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Wordreplace | Tasi Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Wordreplace
                </Typography>
            </Stack>
            <Card>
                <CardContent>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="target"
                                        type="string"
                                        label="Target"
                                        {...getFieldProps('target')}
                                        error={Boolean(touched.target && errors.target)}
                                        helperText={touched.target && errors.target}
                                    />
                                        
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="replace"
                                        type="string"
                                        label="Replace"
                                        {...getFieldProps('replace')}
                                        error={Boolean(touched.replace && errors.replace)}
                                        helperText={touched.replace && errors.replace}
                                    />

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
export default withSnackbar(WordreplaceForm)