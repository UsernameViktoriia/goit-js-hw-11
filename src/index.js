import Notiflix from 'notiflix';
import { fetchImages } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const cards = document.querySelector('.gallery');
let inputSearch = '';
let page = 1;
let totalImages = 0;
let lightbox = new SimpleLightbox('.gallery a');

btnLoadMore.classList.add('is-hidden');

formSearch.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onClickLoadMore);

async function onSubmitForm(e) {
  e.preventDefault();
  cards.innerHTML = '';
  inputSearch = e.currentTarget.searchQuery.value;
  if (inputSearch === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  page = 1;
  try {
    const { data } = await fetchImages(inputSearch, page);
    if (!data.hits.length) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    addMarkup(data.hits);
    lightbox.refresh();
    totalImages = data.hits.length;
    if (totalImages === data.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    if (data.totalHits > 40) {
      btnLoadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, ${error.message} `);
  }
}

async function onClickLoadMore() {
  page += 1;
  try {
    const { data } = await fetchImages(inputSearch, page);
    addMarkup(data.hits);
    lightbox.refresh();
    totalImages += data.hits.length;
    console.log(totalImages);
    console.log(data.totalHits);
    if (totalImages == data.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.classList.add('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, ${error.message} `);
  }
}

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
      <div class="photo-card">
          <a class = "gallery__item" href="${largeImageURL}">
            <img class = "gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width = "400" height="200"/>
          </a>
          <div class="info">
              <p class="info-item">
                  <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                  <b>Views</b> ${views}
              </p>
              <p class="info-item">
                  <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                  <b>Downloads</b> ${downloads}
              </p>
          </div>
       </div>
    `
    )
    .join('');
  cards.insertAdjacentHTML('beforeend', markup);
}
