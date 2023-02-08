import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import RecipeCard from './RecipeCard';
import { createFood, getFoodById, updateFood } from '../../../services/food.service';

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: 16,
  },
  DialogContent: {
    padding: '8px 0',
  },
  DialogActions: {
    padding: '16px 24px',
  },
  marginLeft: {
    marginLeft: '16px !important',
  },
}));

const RecipeDialog = props => {
  const { open, foodId, closeDialog, onUpdate } = props;
  const classes = useStyles();

  const [isEdit, setEdit] = useState(false);
  const [food, setFood] = useState({});

  const refRecipeCard = useRef(null);

  useEffect(() => {
    if (foodId) {
      getFoodById(foodId)
        .then(response => {
          console.log(response.data);
          setFood(response.data);
        })
        .catch(err => console.error(err));
      setEdit(false);
    } else {
      const newFood = {
        description: '',
        difficulty: '',
        duplicatedId: null,
        foodIngredients: [],
        id: 0,
        isDeleted: false,
        metabolism: '',
        name: '',
        preparation: '',
        preparationTime: '',
        tags: [],
      };
      setFood(newFood);
      setEdit(true);
    }
  }, [foodId]);

  const handleSubmit = () => {
    const formData = refRecipeCard.current.submitForm();
    const refreshFood = foodId => {
      getFoodById(foodId)
        .then(response => {
          setFood(response.data);
          onUpdate();
        })
        .catch(err => console.error(err));
    };
    if (foodId) {
      updateFood(foodId, formData).then(() => {
        refreshFood(foodId);
      });
    } else {
      createFood(formData)
        .then(response => {
          refreshFood(response.data.id);
          onUpdate();
        })
        .catch(err => console.error(err));
    }
    setEdit(false);
    closeDialog();
  };

  const handleClose = () => {
    closeDialog();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth='md'
      scroll='paper'
      open={open}
      onClose={handleClose}
      aria-labelledby='recipe-dialog'
    >
      <DialogTitle id='recipe-dialog'>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Avatar aria-label='Recipe' className={classes.avatar}>
                  R
                </Avatar>
              </Grid>
              <Grid item>
                <Typography>{food?.id ? 'Recept szerkesztése' : 'Új recept hozzáadása'}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent className={classes.DialogContent}>
        <RecipeCard ref={refRecipeCard} food={food} isEdit={isEdit}></RecipeCard>
      </DialogContent>
      <DialogActions className={classes.DialogActions}>
        {isEdit && (
          <>
            <Button onClick={() => handleClose()} color='secondary' variant='outlined'>
              Mégsem
            </Button>
            <Button
              onClick={() => handleSubmit()}
              className={classes.marginLeft}
              color='primary'
              variant='contained'
            >
              Mentés
            </Button>
          </>
        )}
        {!isEdit && (
          <Button onClick={() => setEdit(true)} color='primary' variant='contained'>
            Szerkesztés
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
RecipeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  foodId: PropTypes.number,
  closeDialog: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
export default RecipeDialog;
