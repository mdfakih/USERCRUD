import axios from 'axios';

const BASE_URL = 'https://dummyjson.com/users';

export const getAllUserData = async (filters = {}, limit = 20, skip = 0) => {
  let url = BASE_URL;

  if (Object.keys(filters).length > 0) {
    const queryParams = new URLSearchParams();

    if (filters.search) {
      url += `/search`;
      queryParams.append('q', filters.search);
    } else if (filters.gender) {
      url += '/filter';
      queryParams.append('key', 'gender');
      queryParams.append('value', filters.gender);
    }

    queryParams.append('limit', limit);
    queryParams.append('skip', skip);

    url += `?${queryParams.toString()}`;
  }

  //   console.log('url', url);

  const response = await axios.get(url);
  return response;
};

export const getSingleUser = async (id) => {
  const response = await axios.get(`https://dummyjson.com/users/${id}`);
  return response;
};

export const updateUser = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response;
};
export const deleteUser = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response;
};
