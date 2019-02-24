import axios from 'axios';

export default function getRSS(url) {
  return axios.get(`https://cors-anywhere.herokuapp.com/${url}`);
}
