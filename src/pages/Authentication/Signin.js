import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth.slice';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  card: {
    overflow: 'visible',
  },
  session: {
    position: 'relative',
    zIndex: 4000,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  background: {
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    padding: `40px ${theme.spacing(1)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 0 auto',
    flexDirection: 'column',
    minHeight: '100%',
    textAlign: 'center',
  },
  wrapper: {
    flex: 'none',
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
  },
  fullWidth: {
    width: '100%',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
  },
  formText: {
    color: '#f44336',
  },
  alert: {
    color: '#f44336',
  },
  textField: {},
}));

const FacebookButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText('#4267b2'),
    backgroundColor: '#4267b2',
    '&:hover': {
      backgroundColor: '#365899',
    },
  },
}))(Button);

const GoogleButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText('#4285f4'),
    backgroundColor: '#4285f4',
    '&:hover': {
      backgroundColor: '#366dc8',
    },
  },
}))(Button);

const AppleButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText('#333333'),
    backgroundColor: '#333333',
    '&:hover': {
      backgroundColor: '#000000',
    },
  },
}))(Button);

const Signin = () => {
  const [success, setSuccess] = useState('');
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const authUser = useSelector(x => x.auth.user);
  const authError = useSelector(x => x.auth.error);
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) navigate('/');
  }, []);

  const onChangeEmail = e => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = e => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleConnect = (socialProvider, socialData) => {
    setMessage('');
    setLoading(true);
    dispatch(
      authActions.login({ email: socialData.email, password: '', socialProvider, socialData }),
    ).then(
      response => {
        navigate('/');
      },
      error => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      },
    );
  };

  const handleSignIn = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    dispatch(authActions.login({ email, password }))
      .unwrap()
      .then(response => {
        navigate('/');
      })
      .catch(error => {
        const errMsg = error.response?.data?.error?.message ?? error.message ?? error.toString();
        setLoading(false);
        setMessage(errMsg);
      });
  };

  const classes = useStyles();
  return (
    <div className={classNames(classes.session, classes.background)}>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <Card>
            <CardContent>
              <form onSubmit={handleSignIn}>
                <div className={classNames(classes.logo, 'text-xs-center pb-xs')}>
                  <img
                    src={`${process.env.PUBLIC_URL}/static/images/logo-dark.svg`}
                    alt=''
                    className='block'
                  />
                  <Typography variant='caption'>Jelentkezzen be!</Typography>
                </div>
                <TextField
                  id='email'
                  label='E-mail cím'
                  name='email'
                  value={email}
                  autoComplete='on'
                  onChange={onChangeEmail}
                  className={classes.textField}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  id='password'
                  autoComplete='on'
                  label='Jelszó'
                  className={classes.textField}
                  onChange={onChangePassword}
                  type='password'
                  fullWidth
                  margin='normal'
                />

                <FormControlLabel
                  control={<Checkbox value='checkedA' />}
                  label='Maradjak bejelentkezve'
                  className={classes.fullWidth}
                />
                <Button variant='contained' color='primary' fullWidth type='submit'>
                  Bejelentkezés
                </Button>

                <Grid container spacing={3} justifyContent='center'>
                  <Grid item>
                    <Link to='/forgot'>
                      <Button>Elfelejtette jelszavát?</Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to='/signup'>
                      <Button>Regisztrálok</Button>
                    </Link>
                  </Grid>
                </Grid>
                {message && (
                  <Alert severity='error' className='mt-3 mb-0'>
                    {message}
                  </Alert>
                )}
                {!message && authError && (
                  <Alert severity='error' className='mt-3 mb-0'>
                    {authError.message}
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signin;
