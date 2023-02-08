import React, { useRef, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { confirmemail } from '../../services/auth.service';
import { Alert } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { authActions } from 'store';

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
}));

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const hash = params?.hash ?? '';

  const dispatch = useDispatch();

  const [succeed, setSucceed] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSucceed(false);
    setError('');
    if (hash) {
      confirmemail(hash)
        .then(response => {
          if (response.data?.succeed) {
            setSucceed(true);
          } else {
            setError(response.data?.message ?? '');
          }
          if (response.data.user && response.data.token) {
            dispatch(authActions.signin(response.data))
              .unwrap()
              .then(response => {
                setRedirect(true);
                setTimeout(() => {
                  navigate('/');
                }, 3000);
              })
              .catch(error => {
                const errMsg =
                  error.response?.data?.error?.message ?? error.message ?? error.toString();
                setError(errMsg);
              });
          }
        })
        .catch(error => {
          console.log(error);
          const errMsg = error.response?.data?.error?.message ?? error.message ?? error.toString();
          setError(errMsg);
        });
    }
  }, [hash]);

  const classes = useStyles();
  return (
    <div className={classNames(classes.session, classes.background)}>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <Card>
            <CardContent>
              <div className={classNames(classes.logo, 'text-xs-center pb-xs')}>
                <img
                  src={`${process.env.PUBLIC_URL}/static/images/logo-dark.svg`}
                  alt=''
                  className='block'
                />
                {succeed && (
                  <Typography variant='h5'>Sikeresen megerősítette e-mail fiókját!</Typography>
                )}
                {!succeed && (
                  <>
                    <Typography variant='h5' color='secondary'>
                      Hiba a megerősítés során!
                    </Typography>
                    <Alert className='mt-1' severity='error'>
                      {error}
                    </Alert>
                  </>
                )}
              </div>
              {redirect && (
                <Alert severity='success'>Beléptettünk! Az oldal hamarosan újratöltődik!</Alert>
              )}
              {!redirect && (
                <Link to={'/signin'}>
                  <Button variant='contained' color='primary' fullWidth className='mt-1'>
                    Bejelentkezés
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
