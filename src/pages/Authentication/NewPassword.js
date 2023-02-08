import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { newpassword } from '../../services/auth.service';
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
}));

const NewPassword = () => {
  const params = useParams();
  const hash = params?.hash ?? '';
  const navigate = useNavigate();

  const [npassword, setNewPassword] = useState('');
  const [cpassword, setConfirmPassword] = useState('');
  const [nerror, setNerror] = useState(false);
  const [cerror, setCerror] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!nerror && !cerror) {
      newpassword(hash, npassword).then(
        response => {
          setError('');
          if (response.data?.success) {
            navigate('/signin');
          } else {
            setError(response.data?.message ?? 'Váratlan hiba történt!');
          }
        },
        error => {
          console.log(error);
        },
      );
    }
  };

  useEffect(() => {
    if (npassword && !npassword.match(/^.{6,}$/)) {
      setNerror(true);
    } else {
      setNerror(false);
    }
    if (npassword !== cpassword) {
      setCerror(true);
    } else {
      setCerror(false);
    }
  }, [npassword, cpassword]);

  const classes = useStyles();
  return (
    <div className={classNames(classes.session, classes.background)}>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit} autoComplete='off'>
                <div className={classNames(classes.logo, 'text-xs-center pb-xs')}>
                  <img src={`${process.env.PUBLIC_URL}/static/images/logo-dark.svg`} alt='' />
                  <Typography variant='caption'>Adja meg új jelszavát!</Typography>
                </div>
                <TextField
                  id='npassword'
                  label='Új jelszó'
                  className={classes.textField}
                  onChange={e => setNewPassword(e.target.value)}
                  value={npassword}
                  type='password'
                  fullWidth
                  required
                  margin='normal'
                  error={nerror}
                  helperText={nerror ? 'Nem megfelelő jelszó!' : ''}
                />
                <TextField
                  id='cpassword'
                  label='Jelszó megerősítése'
                  className={classes.textField}
                  onChange={e => setConfirmPassword(e.target.value)}
                  value={cpassword}
                  type='password'
                  fullWidth
                  required
                  margin='normal'
                  error={cerror}
                  helperText={cerror ? 'A jelszavak nem egyeznek meg!' : ''}
                />
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  className='mt-1'
                  disabled={nerror || cerror || !npassword}
                  type='submit'
                >
                  Új jelszó elküldése
                </Button>
                {error && (
                  <Alert className='mt-1' severity='error'>
                    {error}
                  </Alert>
                )}
                <div className='pt-1 text-xs-center'>
                  <Link to='/signin'>
                    <Button>Belépés</Button>
                  </Link>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link to='/signup'>
                    <Button>Regisztráció</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
