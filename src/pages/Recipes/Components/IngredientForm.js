import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { newItem } from '../../../services/constants';
import { Switch } from '@material-ui/core';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  ingredient: {
    flexGrow: 1,
  },
  quantityWrapper: {
    width: 270,
  },
  quantity: {
    width: 120,
  },
  variable: {
    width: 70,
    padding: 0,
  },
  margin0: {
    margin: 0,
  },
}));

const IngredientFormForwardRef = (props, ref) => {
  useImperativeHandle(ref, () => ({
    // submitForm() {
    //   return getValues();
    // },
  }));

  const { ingredients, quantityUnits, currentIngredient, onChange: handleOnChange } = props;
  const classes = useStyles();

  const [ingredient, setIngredient] = useState({});
  const [quantityUnit, setQuantityUnit] = useState(newItem);
  const [quantity, setQuantity] = useState(0);
  const [isVariable, setIsVariable] = useState(false);
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [ingredientInputValue, setIngredientInputValue] = useState('');
  const [quantityUnitOpen, setQuantityUnitOpen] = useState(false);

  const { user: authUser } = useSelector(x => x.auth);

  useEffect(() => {
    setIngredient(currentIngredient.ingredient);
    setQuantityUnit(currentIngredient.quantityUnits);
    setQuantity(currentIngredient.quantity);
    setIsVariable(currentIngredient.isVariable);
    setMinQuantity(currentIngredient.minQuantity);
    setMaxQuantity(currentIngredient.maxQuantity);
  }, [currentIngredient]);

  useEffect(() => {
    handleOnChange(
      currentIngredient,
      ingredient,
      quantityUnit,
      quantity,
      isVariable,
      minQuantity,
      maxQuantity,
    );
  }, [ingredient, quantityUnit, quantity, isVariable, minQuantity, maxQuantity]);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  const filter = createFilterOptions();
  return (
    <>
      <FormControl fullWidth className={classes.margin} variant='outlined'>
        <Grid container spacing={2}>
          <Grid item className={classes.ingredient}>
            <Autocomplete
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setIngredient({
                    name: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setIngredient({
                    name: newValue.inputValue,
                  });
                } else {
                  console.log('existing', newValue);
                  setIngredient(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              getOptionSelected={(option, selected) => option.id === selected.id}
              options={ingredients}
              inputValue={ingredientInputValue}
              onInputChange={(event, newInputValue) => {
                setIngredientInputValue(newInputValue);
              }}
              value={ingredient}
              getOptionLabel={option => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                return option?.name ?? '';
              }}
              freeSolo
              openOnFocus
              renderInput={params => (
                <TextField
                  autoFocus
                  {...params}
                  name='ingredient'
                  label='Hozzávaló'
                  required
                  variant='outlined'
                />
              )}
            />
          </Grid>
          <Grid item container className={classes.quantityWrapper} direction={'column'}>
            <Grid item container>
              {authUser?.user?.permissions?.includes('AdminPerm') && (
                <Grid item className={classes.variable}>
                  <FormControlLabel
                    control={
                      <Switch
                        aria-labelledby={'is-variable-label'}
                        checked={isVariable}
                        onClick={event => {
                          setIsVariable(event.target.checked);
                        }}
                        {...register('isVariable')}
                      />
                    }
                    className={classes.margin0}
                    labelPlacement={'top'}
                    label={<SettingsEthernetIcon />}
                  />
                </Grid>
              )}
              <Grid item className={classes.quantity}>
                <TextField
                  type='number'
                  label='Mennyiség'
                  {...register('quantity', {
                    required: true,
                  })}
                  required
                  value={quantity}
                  onChange={event => setQuantity(Number(event.target.value))}
                  onFocus={event => {
                    event.target.select();
                  }}
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <Select
                  {...register('quantityUnitId', {
                    required: true,
                  })}
                  required
                  open={quantityUnitOpen}
                  value={quantityUnits.find(item => item.id === quantityUnit.id)}
                  onChange={event => setQuantityUnit(event.target.value)}
                  onFocus={event => {
                    if (!quantityUnit?.id) {
                      setQuantityUnitOpen(true);
                    }
                  }}
                  onOpen={() => {
                    setQuantityUnitOpen(true);
                  }}
                  onClose={() => {
                    setQuantityUnitOpen(false);
                  }}
                  variant='outlined'
                >
                  {quantityUnits &&
                    quantityUnits.map((quantity, index) => (
                      <MenuItem key={index} value={quantity}>
                        {quantity.name}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </Grid>
            {isVariable && (
              <Grid container>
                <Grid item className={classes.quantity}>
                  <TextField
                    type='number'
                    label='Minimum'
                    {...register('minQuantity', {
                      required: true,
                    })}
                    required
                    value={minQuantity}
                    onChange={event => setMinQuantity(Number(event.target.value))}
                    onFocus={event => {
                      event.target.select();
                    }}
                    variant='outlined'
                  />
                </Grid>
                <Grid item>
                  <Typography variant={'h4'}>-</Typography>
                </Grid>
                <Grid item className={classes.quantity}>
                  <TextField
                    type='number'
                    label='Maximum'
                    {...register('maxQuantity', {
                      required: true,
                    })}
                    required
                    value={maxQuantity}
                    onChange={event => setMaxQuantity(Number(event.target.value))}
                    onFocus={event => {
                      event.target.select();
                    }}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </FormControl>
    </>
  );
};
const IngredientForm = forwardRef(IngredientFormForwardRef);
IngredientForm.propTypes = {
  ingredients: PropTypes.array,
  quantityUnits: PropTypes.array,
  currentIngredient: PropTypes.object,
  onChange: PropTypes.func,
};

export default IngredientForm;
