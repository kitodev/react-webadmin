import { fetchWrapper } from '../helpers/fetch-wrapper';

export const patchNutrients = (id, data) => {
  return fetchWrapper.patch(`/nutrients/${id}`, data);
};

export const postNutrients = data => {
  return fetchWrapper.post(`/nutrients`, data);
};

export const patchIngredients = (id, data) => {
  return fetchWrapper.patch(`/ingredients/${id}`, data);
};

export const postIngredients = data => {
  return fetchWrapper.post(`/ingredients`, data);
};
