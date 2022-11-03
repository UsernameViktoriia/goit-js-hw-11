import Notiflix from 'notiflix';
import { fetchImages } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const cards = document.querySelector('.gallery');
let inputSearch = '';
let page = 1;

btnLoadMore.classList.add('is-hidden');

formSearch.addEventListener('submit', e => {
  e.preventDefault();
  cards.innerHTML = '';
  inputSearch = e.currentTarget.searchQuery.value;
  if (inputSearch === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  page = 1;
  fetchImages(inputSearch, page).then(response =>
    addMarkup(response.data.hits)
  );
  btnLoadMore.classList.remove('is-hidden');
});

btnLoadMore.addEventListener('click', () => {
  page += 1;
  fetchImages(inputSearch, page).then(response => {
    // console.log('response');
    addMarkup(response.data.hits);
  });
  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
});

function addMarkup(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => `
    <a class = "gallery__item" href="${largeImageURL}">
        
            <img class = "gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads ${downloads}</b>
                </p>
            </div>
       
    </a>`
    )
    .join('');
  cards.insertAdjacentHTML('beforeend', markup);
}
