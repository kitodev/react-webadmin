import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { forgottpassword } from '../../services/auth.service';

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

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    forgottpassword(email).then(
      response => {
        navigate('/signin');
      },
      error => {
        console.log(error);
      },
    );
  };
  const classes = useStyles();
  return (
    <div className={classNames(classes.session, classes.background)}>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className={classNames(classes.logo, 'text-xs-center pb-xs')}>
                  <img src={`${process.env.PUBLIC_URL}/static/images/logo-dark.svg`} alt='' />
                  <Typography variant='caption'>
                    Adja meg e-mail címét, és mi elküldjük Önnek, hogyan állítsa vissza jelszavát.
                  </Typography>
                </div>
                <TextField
                  id='email'
                  label='E-mail cím'
                  required
                  className={classes.textField}
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  fullWidth
                  margin='normal'
                />
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  className='mt-1'
                  type='submit'
                >
                  Elfelejtett jelszó küldése
                </Button>
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

export default PasswordReset;
