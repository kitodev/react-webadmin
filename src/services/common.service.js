import { fetchWrapper } from '../helpers/fetch-wrapper';

export const getNutrients = () => {
  return fetchWrapper.get(`/nutrients`, {});
};

export const getQuantityUnits = () => {
  return fetchWrapper.get(`/quantity-units`, {});
};

export const getTags = () => {
  return fetchWrapper.get(`/tags`, {});
};
