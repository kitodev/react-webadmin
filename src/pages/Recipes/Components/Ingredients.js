import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CreateIcon from '@material-ui/icons/Create';
import AddCircleIcon from '@material-ui/icons/AddCircle';



import Button from '@material-ui/core/Button';
import { getIngredientsList, getQuantityUnits } from '../../../services/food.service';
import IngredientForm from './IngredientForm';
import { newItem } from '../../../services/constants';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  primary: {
    backgroundColor: 'red',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  width100: {
    width: '100%',
  },
  name: {
    margin: `${theme.spacing(1) * 4}px 0 ${theme.spacing(1) * 2}px`,
  },
  listItemText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    paddingRight: '120px',
  },
  ingredientControl: {
    margin: '0',
    width: '100%',
    paddingRight: '1rem',
  },
  weightControl: {
    margin: '0',
    maxWidth: 120,
  },
}));

const Ingredients = props => {
  const { food, isEdit, onChange } = props;
  const classes = useStyles();

  const [ingredients, setIngredients] = useState({});
  const [editedIngredients, setEditedIngredients] = useState([]);
  const [foodIngredients, setFoodIngredients] = useState([]);
  const [quantityUnits, setQuantityUnits] = useState([]);
  const [changedIngredients, setChangedIngredients] = useState({});

  const getIngredient = () => {
    getIngredientsList()
      .then(response => {
        const ingredients = [newItem, ...response.data];
        setIngredients(ingredients);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getQuantityUnit = () => {
    getQuantityUnits()
      .then(response => {
        const quantityUnits = [newItem, ...response.data];
        setQuantityUnits(quantityUnits);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getIngredient();
    getQuantityUnit();
  }, []);

  useEffect(() => {
    setFoodIngredients(food?.foodIngredients ?? []);
  }, [food]);

  const handleChange = (
    changedIngredient,
    ingredient,
    quantityUnit,
    quantity,
    isVariable,
    minQuantity,
    maxQuantity,
  ) => {
    const newChangedIngredients = JSON.parse(JSON.stringify(changedIngredients));
    newChangedIngredients[changedIngredient.id] = {
      id: changedIngredient.id,
      foodId: food.id,
      ingredient: ingredient ?? newItem,
      ingredientId: ingredient?.id ?? 0,
      quantityUnits: quantityUnit ?? newItem,
      quantityUnitId: quantityUnit?.id ?? 0,
      quantity: quantity ?? 0,
      isVariable: isVariable ?? false,
      minQuantity: minQuantity ?? 0,
      maxQuantity: maxQuantity ?? 0,
    };
    setChangedIngredients(newChangedIngredients);
  };

  const handleAddIngredient = () => {
    const newChangedIngredients = JSON.parse(JSON.stringify(changedIngredients));
    const newId = (Object.keys(changedIngredients).filter(item => item < 0).length + 1) * -1;
    newChangedIngredients[newId] = {
      id: newId,
      foodId: food.id,
      ingredient: newItem,
      ingredientId: 0,
      quantityUnits: newItem,
      quantityUnitId: 0,
      quantity: 0,
      isVariable: false,
      minQuantity: 0,
      maxQuantity: 0,
    };
    setChangedIngredients(newChangedIngredients);
    setFoodIngredients([...foodIngredients, newChangedIngredients[newId]]);
    handleEditIngredient(newId);
  };

  const handleSubmitIngredients = itemId => {
    const newFoodIngredients = JSON.parse(JSON.stringify(foodIngredients));
    if (changedIngredients[itemId]) {
      const index = newFoodIngredients.findIndex(item => item.id === itemId);
      if (index !== -1) {
        if (!changedIngredients[itemId].ingredientId) {
          changedIngredients[itemId].ingredientId = 0;
          changedIngredients[itemId].ingredient.id = 0;
        }
        if (!changedIngredients[itemId].ingredient.quantityUnitId) {
          changedIngredients[itemId].ingredient.quantityUnitId =
            changedIngredients[itemId].quantityUnitId;
        }
        newFoodIngredients[index] = changedIngredients[itemId];
      }
      setEditedIngredients(editedIngredients.filter(item => item !== itemId));
      setFoodIngredients(newFoodIngredients);
    }
    onChange(newFoodIngredients);
  };

  const handleRemoveIngredients = itemId => {
    const newFoodIngredients = JSON.parse(JSON.stringify(foodIngredients));
    const index = newFoodIngredients.findIndex(item => item.id === itemId);
    if (index !== -1) {
      newFoodIngredients.splice(index, 1);
    }
    setFoodIngredients(newFoodIngredients);
    onChange(newFoodIngredients);
  };

  const handleEditIngredient = id => {
    setEditedIngredients([...editedIngredients, id]);
  };

  return (
    <List>
      {foodIngredients.map((item, key) => (
        <ListItem key={item.id} className={classes.listItem}>
          {editedIngredients.includes(item.id) && (
            <IngredientForm
              ingredients={ingredients}
              quantityUnits={quantityUnits}
              currentIngredient={item}
              onChange={handleChange}
            ></IngredientForm>
          )}
          {!editedIngredients.includes(item.id) && (
            <ListItemText
              className={classes.listItemText}
              primary={item.ingredient.name}
              secondary={item.quantity + item.quantityUnits.name}
              primaryTypographyProps={{ style: { paddingRight: '1rem' } }}
            />
          )}

          {isEdit && !editedIngredients.includes(item.id) && (
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleEditIngredient(item.id)} aria-label='Edit'>
                <CreateIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
          {isEdit && editedIngredients.includes(item.id) && (
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleRemoveIngredients(item.id)} aria-label='Delete'>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleSubmitIngredients(item.id)} aria-label='Apply'>
                <CheckIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}

      {isEdit && (
        <ListItem className={classes.listItem}>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Button
                onClick={() => handleAddIngredient()}
                variant='contained'
                color='primary'
                startIcon={<AddCircleIcon />}
              >
                Hozzávaló hozzáadása
              </Button>
            }
          />
        </ListItem>
      )}
    </List>
  );
};
Ingredients.propTypes = {
  food: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
};
export default Ingredients;
