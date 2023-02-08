import React, { useRef, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { signup } from '../../services/auth.service';
import { FormControl, FormHelperText } from '@material-ui/core';

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
  success: {
    color: '#4BB543',
  },
  alert: {
    color: '#f44336',
  },
  textField: {},
  alignLeft: {
    '& .MuiFormControlLabel-label': {
      textAlign: 'left',
    },
  },
}));

const Signup = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const { register, handleSubmit } = useForm();

  const classes = useStyles();

  const onSubmit = (data, e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    delete data.isTerms;
    signup(data)
      .then(response => {
        setMessage(response.data.message);
        setSuccess(true);
        navigate('/signin');
      })
      .catch(error => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccess(false);
      });
  };

  const onError = (errors, e) => {
    const formErrors = {};
    if (Object.keys(errors).length) {
      for (const attr in errors) {
        formErrors[attr] = errors[attr]?.message ?? true;
      }
    }
    setErrors(formErrors);
  };

  return (
    <div className={classNames(classes.session, classes.background)}>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                {!success && (
                  <div>
                    <div className={classNames(classes.logo, 'text-xs-center pb-xs')}>
                      <img src={`${process.env.PUBLIC_URL}/static/images/logo-dark.svg`} alt='' />
                      <Typography variant='caption'>
                        A folytatáshoz hozzon létre egy fiókot.
                      </Typography>
                    </div>
                    <TextField
                      label='Keresztnév'
                      className={classes.textField}
                      {...register('firstName', {
                        required: 'Kötelező mező',
                      })}
                      fullWidth
                      margin='normal'
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                    <TextField
                      label='Vezetéknév'
                      className={classes.textField}
                      {...register('lastName', {
                        required: 'Kötelező mező',
                      })}
                      fullWidth
                      margin='normal'
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                    <TextField
                      label='E-mail cím'
                      className={classes.textField}
                      {...register('email', {
                        required: 'Kötelező mező',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Nem megfelelő e-mail formátum',
                        },
                      })}
                      fullWidth
                      margin='normal'
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                    <TextField
                      label='Jelszó'
                      className={classes.textField}
                      {...register('password', {
                        required: 'Kötelező mező',
                        pattern: {
                          value: /^.{6,}$/,
                          message: 'Nem megfelelő jelszó, legalább 6 karaktert adjon meg!',
                        },
                      })}
                      type='password'
                      fullWidth
                      margin='normal'
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                    <FormControl className={classes.fullWidth}>
                      <FormControlLabel
                        control={<Checkbox {...register('isNewsletter')} />}
                        label='Feliratkozom a hírlevélre'
                        className={[classes.fullWidth, classes.alignLeft].join(' ')}
                      />
                    </FormControl>
                    <FormControl className={classes.fullWidth}>
                      <FormControlLabel
                        control={<Checkbox {...register('isResearch')} />}
                        label='Kutatási célból engedélyezem az adataim anonim felhasználását'
                        className={[classes.fullWidth, classes.alignLeft].join(' ')}
                      />
                    </FormControl>
                    <FormControl className={classes.fullWidth} error={!!errors.isTerms}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...register('isTerms', {
                              required: 'Kötelező elfogadnia a feltételeket!',
                            })}
                          />
                        }
                        label='Elolvastam és elfogadom a jogi szabályzatot'
                        className={[classes.fullWidth, classes.alignLeft].join(' ')}
                      />
                      <FormHelperText>{errors.isTerms}</FormHelperText>
                    </FormControl>
                    <Button variant='contained' color='primary' fullWidth type='submit'>
                      Regisztrálok
                    </Button>
                  </div>
                )}
                {message && (
                  <div className='form-group'>
                    <div className={success ? classes.success : classes.alert} role='alert'>
                      {message}
                    </div>
                  </div>
                )}
                <div className='pt-1 text-xs-center'>
                  <Link to='/forgot'>
                    <Button>Elfelejtette jelszavát?</Button>
                  </Link>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Link to='/signin'>
                    <Button>Belépés</Button>
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

export default Signup;
