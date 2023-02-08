import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Alert from '@material-ui/lab/Alert';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BackupIcon from '@material-ui/icons/Backup';
import ListIcon from '@material-ui/icons/List';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import TextField from '@material-ui/core/TextField';
import parse from 'html-react-parser';
import Tags from './Tags';
import Ingredients from './Ingredients';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import { defaultCover } from '../../../services/constants';

const useStyles = makeStyles(theme => ({
  card: {
    // maxWidth: 400,
    border: 'none',
    boxShadow: 'none',
  },
  media: {
    position: 'relative',
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  mediaDragAndDropOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 80,
  },
  mediaDragAndDropOverlayDragging: {
    zIndex: 100,
  },
  mediaDragAndDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  mediaDragging: {
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.standard,
    }),
    backgroundColor: 'rgba(0, 0, 0, 20%)',
  },
  mediaNonDragging: {
    backgroundColor: 'transparent',
  },
  mediaButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 91,
  },
  mediaError: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'end',
  },
  marginBottom: {
    marginBottom: '12px',
  },
  padding: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  textfield: {
    color: 'white',
    borderColor: 'white',
  },
  textarea: {
    width: '100%',
  },
  title: {
    width: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500],
  },
  icon: {
    position: 'relative',
    top: '3px',
    fontSize: '1rem',
  },
  divider: {
    margin: '1rem 0',
  },
}));

const recipeCardForwardRef = (props, ref) => {
  useImperativeHandle(ref, () => ({
    submitForm() {
      return getValues();
    },
  }));
  const { food, isEdit } = props;
  const classes = useStyles();

  food.description = food.description
    .replace(/(<\/([^>]+)>)/gi, `\r\n`)
    .replace(/(<([^>]+)>)/gi, '');
  food.preparation = food.preparation
    .replace(/(<\/([^>]+)>)/gi, `\r\n`)
    .replace(/(<([^>]+)>)/gi, '');

  const [images, setImages] = React.useState([]);
  const [coverImage, setCoverImage] = React.useState('');
  const [foodMedias, setFoodMedias] = React.useState([]);
  const maxNumber = 2;

  useEffect(() => {
    setFoodMedias(food?.foodMedias ?? []);

    let cover = defaultCover;
    if (food?.foodMedias?.length) {
      const coverMedia = food.foodMedias.find(item => item.isCover === true);
      if (coverMedia) {
        cover = coverMedia.media;
      } else {
        cover = food.foodMedias[food.foodMedias.length - 1].media;
      }
      setImages([{ dataUrl: cover }]);
      setCoverImage(
        cover.match(/^\/media\//) ? `${process.env.REACT_APP_API_ENDPOINT}${cover}` : cover,
      );
    } else {
      setCoverImage(cover);
    }
  }, [food]);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  const handleTagsChange = value => {
    const newTags = JSON.parse(JSON.stringify(value));
    for (const tag of newTags) {
      if (tag.id < 0 && tag.inputValue && tag.name) {
        tag.name = tag.inputValue;
        delete tag.inputValue;
      }
    }
    setValue('tags', newTags);
  };

  const handleIngredientsChange = value => {
    setValue('foodIngredients', value);
  };

  const onMediaChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    const newFoodMedias = JSON.parse(JSON.stringify(foodMedias));
    const coverIndexes = newFoodMedias.findIndex(item => item.isCover === true);
    if (coverIndexes?.length) {
      for (const coverIndex of coverIndexes) {
        newFoodMedias[coverIndex].isCover = false;
      }
    }
    setFoodMedias(newFoodMedias);

    setImages(imageList);
    setCoverImage(imageList[addUpdateIndex].dataUrl);
    const value = [
      {
        id: 0,
        foodId: food?.id ?? 0,
        isCover: true,
        isVideo: false,
        media: imageList[addUpdateIndex].dataUrl,
      },
    ];
    setValue('foodMedias', value);
  };

  return (
    <form>
      <Card className={classes.card}>
        {/* CARD HEADER */}
        {isEdit && (
          <CardHeader
            title={
              <TextField
                id='title'
                type='text'
                className={classes.title}
                label='Recept neve'
                variant='outlined'
                size='small'
                {...register('name', {
                  minLength: {
                    value: 4,
                  },
                  value: food?.name ?? '',
                  onChange: e => {
                    //   setName(e.target.value);
                  },
                })}
              />
            }
          />
        )}
        {!isEdit && (
          <CardHeader
            title={food?.name}
          />
        )}

        {/* CARD MEDIA */}
        {coverImage && (
          <CardMedia
            className={[classes.media, classes.marginBottom].join(' ')}
            image={coverImage}
            title={food?.name ?? ''}
            children={
              isEdit && (
                <>
                  <ImageUploading
                    value={images}
                    onChange={onMediaChange}
                    maxNumber={maxNumber}
                    dataURLKey='dataUrl'
                    maxFileSize={5 * 1024 * 1024}
                    resolutionType='more'
                    resolutionWidth={799}
                    resolutionHeight={499}
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                      errors,
                    }) => (
                      <>
                        <Box
                          {...dragProps}
                          onClick={() => onImageUpdate(0)}
                          className={[
                            'mediaDragNDrop',
                            classes.mediaDragAndDrop,
                            isDragging ? classes.mediaDragging : classes.mediaNonDragging,
                            isDragging ? 'mediaDragging' : '',
                          ].join(' ')}
                        >
                          {errors && (
                            <Alert severity='error' className={classes.mediaError}>
                              {errors.maxNumber && (
                                <span>Number of selected images exceed maxNumber</span>
                              )}
                              {errors.acceptType && (
                                <span>Your selected file type is not allow</span>
                              )}
                              {errors.maxFileSize && (
                                <span>Selected file size exceed maxFileSize</span>
                              )}
                              {errors.resolution && (
                                <span>Selected file is not match your desired resolution</span>
                              )}
                            </Alert>
                          )}
                          <Fab
                            color={isDragging ? 'primary' : 'secondary'}
                            className={classes.mediaButton}
                          >
                            <BackupIcon />
                          </Fab>
                        </Box>
                      </>
                    )}
                  </ImageUploading>
                  <TextField
                    type='hidden'
                    {...register('foodMedias', { value: foodMedias ?? [] })}
                  />
                </>
              )
            }
          />
        )}

        <Box
          bgcolor='primary.main'
          className={[classes.marginBottom, classes.padding].join(' ')}
          color='white'
        >
          <Grid container spacing={3}>
            <Grid item xs>
              {!isEdit && (
                <Typography align='center'>
                  mérsékelt
                  <br />
                  <small>anyagcsere</small>
                </Typography>
              )}
              {isEdit && (
                <TextField
                  className={classes.textfield}
                  label='anyagcsere'
                  variant='outlined'
                  size='small'
                  {...register('metabolism', { value: food?.metabolism ?? '' })}
                />
              )}
            </Grid>
            <Grid item xs>
              {!isEdit && (
                <Typography align='center'>
                  {food?.preparationTime}
                  <br />
                  <small>elkészítési idő</small>
                </Typography>
              )}
              {isEdit && (
                <TextField
                  {...register('preparationTime', { value: food?.preparationTime ?? '' })}
                  className={classes.textfield}
                  label='elkészítési idő'
                  variant='outlined'
                  size='small'
                />
              )}
            </Grid>
            <Grid item xs>
              {!isEdit && (
                <Typography align='center'>
                  {food?.difficulty}
                  <br />
                  <small>nehézség</small>
                </Typography>
              )}
              {isEdit && (
                <TextField
                  {...register('difficulty', { value: food?.difficulty ?? '' })}
                  className={classes.textfield}
                  label='nehézség'
                  variant='outlined'
                  size='small'
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* CONTENTS */}
        <CardContent>
          {!isEdit && (
            <Typography component='div' gutterBottom>
              {parse(food?.description.replace(/\r\n/gi, '<br />'))}
            </Typography>
          )}
          {isEdit && (
            <TextField
              id='description'
              className={classes.textarea}
              label='Leírás'
              multiline
              minrows={4}
              {...register('description', { value: food?.description ?? '' })}
              variant='outlined'
            />
          )}
          <Divider className={classes.divider} />

          {/* TAGS */}
          {(isEdit || food?.tags?.length) && (
            <>
              <Box className={classes.marginBottom}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  <LocalOfferIcon className={classes.icon}></LocalOfferIcon> Címkék
                </Typography>
                <Tags food={food} onChange={handleTagsChange} isEdit={isEdit} />
                <TextField type='hidden' {...register('tags', { value: food?.tags ?? [] })} />
              </Box>
              <Divider className={classes.divider} />
            </>
          )}

          {/* INGREDIENTS */}
          {(isEdit || food?.foodIngredients?.length) && (
            <>
              <Box className={classes.marginBottom}>
                <Typography variant='subtitle2' color='primary' gutterBottom>
                  <ListIcon className={classes.icon}></ListIcon> Hozzávalók
                </Typography>
                <Ingredients food={food} onChange={handleIngredientsChange} isEdit={isEdit} />
                <TextField
                  type='hidden'
                  {...register('foodIngredients', { value: food?.ingredients ?? [] })}
                />
              </Box>
              <Divider className={classes.divider} />
            </>
          )}

          {/* PREPARATION */}
          <Typography variant='subtitle2' color='primary' gutterBottom>
            <FormatListNumberedIcon className={classes.icon}></FormatListNumberedIcon> Elkészítés
          </Typography>
          {!isEdit && (
            <Typography component='div'>
              {parse(
                food?.preparation
                  .replace(/\r\n[\s]?$/, '')
                  .replace(/[\r\n]/gi, '<br />')
                  .replace(/(<br \/>){2,}/gi, '<br />')
                  .replace(/<br \/>$/, ''),
              )}
            </Typography>
          )}
          {isEdit && (
            <TextField
              id='description'
              className={classes.textarea}
              label='Elkészítés'
              multiline
              minrows={4}
              {...register('preparation', { value: food?.preparation ?? '' })}
              variant='outlined'
            />
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const RecipeCard = forwardRef(recipeCardForwardRef);
RecipeCard.propTypes = {
  food: PropTypes.any.isRequired,
  isEdit: PropTypes.bool.isRequired,
};
export default RecipeCard;
