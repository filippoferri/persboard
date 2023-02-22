import axios from 'axios';
// config
import { HOST_API_OPENAI } from '../config-global';

// ----------------------------------------------------------------------

const axiosOpenai = axios.create({ baseURL: HOST_API_OPENAI });

axiosOpenai.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosOpenai;
