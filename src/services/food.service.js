import { fetchWrapper } from '../helpers/fetch-wrapper';

export const getFoundationFoodsList = (order = ['id ASC'], offset = 0, limit = 24) => {
  const params = {
    order,
    offset,
    limit,
  };
  return fetchWrapper.get('/foundation-foods', params);
};

export const getQuantityUnits = params => {
  try {
    return fetchWrapper.get('/quantity-units', params);
  } catch (err) {
    console.log('Error while calling getQuantityUnits', err.message);
  }
};

export const getFoodsList = (order = ['id ASC'], offset = 0, limit = 25, search) => {
  const params = {
    order,
    skip: offset,
    limit,
  };
  if (search) {
    params.where = {
      or: [
        { name: { like: '%' + search + '%' } },
        { description: { like: '%' + search + '%' } },
        { preparation: { like: '%' + search + '%' } },
      ],
    };
  }
  return fetchWrapper.get('/food/simple', params);
};

export const getFoodsCount = search => {
  const params = {};
  if (search) {
    params.where = {
      or: [
        { name: { like: '%' + search + '%' } },
        { description: { like: '%' + search + '%' } },
        { preparation: { like: '%' + search + '%' } },
      ],
    };
  }
  return fetchWrapper.get('/food/count', params);
};

export const deleteFood = id => {
  return fetchWrapper.delete(`/food/${id}`);
};

export const updateFood = (id, data) => {
  try {
    return fetchWrapper.patch(`/food/${id}`, data);
  } catch (err) {
    console.error('Error while calling updateFood', err.message);
  }
};

export const getFoodById = (id, data) => {
  try {
    return fetchWrapper.get(`/food/by-id/${id}`, data);
  } catch (err) {
    console.error('Error while calling getFoodsById', err.message);
  }
};

export const createFood = data => {
  return fetchWrapper.post('/food', data);
};

export const getTagsList = params => {
  return fetchWrapper.get('/tags', { params: params });
};

export const getIngredientsList = params => {
  return fetchWrapper.get('/food/ingredients', { params: params });
};
