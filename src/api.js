import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const keyApi = '31020563-d44473fd087eb3f9b37189b03';

export function fetchImages(input, page) {
  console.log(input);

  return axios.get(
    `/?key=${keyApi}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
}
