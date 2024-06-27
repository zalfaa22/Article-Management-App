import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://103.164.54.252:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
