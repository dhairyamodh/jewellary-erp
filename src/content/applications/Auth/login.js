import { LoadingButton } from '@mui/lab';
import {
  Box,
  Typography,
  Container,
  styled,
  CardContent,
  Grid,
  Card,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginAsync } from 'src/redux/auth/authThunk';

const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      overflow: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  `
);

function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: { email: 'admin@gmail.com', password: '123456' }
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [submitLoading, setSubmitLoading] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const onSubmit = (data) => {
    try {
      setSubmitLoading(true);
      dispatch(loginAsync(data));
    } catch (error) {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent>
                <Box textAlign="center">
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    Login
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="Email"
                      fullWidth
                      {...register('email', {
                        required: true
                      })}
                      error={Boolean(errors?.email)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      fullWidth
                      {...register('password', {
                        required: true
                      })}
                      error={Boolean(errors?.password)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <LoadingButton
                        loading={submitLoading}
                        variant="contained"
                        type="submit"
                      >
                        Submit
                      </LoadingButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Container>
      </MainContent>
    </>
  );
}

export default Login;
