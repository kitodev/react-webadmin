import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { getTagsList } from '../../../services/food.service';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const Tags = props => {
  const { food, isEdit, onChange } = props;
  const classes = useStyles();
  const [value, setValue] = useState([]);
  const [newId, setNewId] = useState(-1);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  useEffect(() => {
    setValue(food?.tags ?? []);
  }, [food]);

  useEffect(() => {
    getTagsList()
      .then(response => {
        const tags = [];
        response.data.map((item, key) => {
          tags.push(item);
        });
        setTags(tags);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const filter = createFilterOptions();

  return (
    <>
      {!isEdit && food?.tags?.length && (
        <Box className={classes.root}>
          {food?.tags.map((item, key) => (
            <Chip key={key} label={item.name} />
          ))}
        </Box>
      )}
      {isEdit && (
        <Autocomplete
          multiple
          id='tags'
          name='tags'
          options={tags}
          value={value}
          freeSolo
          getOptionLabel={option => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }

            return option.name;
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setValue({
                name: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue({
                name: newValue.inputValue,
              });
            } else {
              setValue(newValue);
            }
            setNewId((newValue.filter(item => item.id < 0).length + 1) * -1);
          }}
          getOptionSelected={(option, selected) => option.id === selected.id}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                id: newId,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          renderInput={params => (
            <TextField
              {...params}
              name='tags'
              variant='outlined'
              label='Címkék'
              placeholder='Kedvencek'
            />
          )}
        />
      )}
    </>
  );
};
Tags.propTypes = {
  food: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
};
export default Tags;
