document.addEventListener('DOMContentLoaded', function () {
  const newsTableBody = document.getElementById('newsTableBody');
  const carouselInner = document.querySelector('.carousel-inner');
  let favorites = [];

 
  function populateCarousel(articlesData) {
    carouselInner.innerHTML = '';

    for (let i = 0; i < 3; i++) {
      const article = articlesData[i];
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (i === 0) {
        carouselItem.classList.add('active');
      }
      const imageUrl = article.urlToImage ? article.urlToImage : 'img/newss.jpg';
      carouselItem.innerHTML = `
        <img src="${imageUrl}" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5>${article.title}</h5>
          <p>${article.description}</p>
        </div>
      `;
      carouselInner.appendChild(carouselItem);
    }
  }


  function populateNews(articlesData) {
    newsTableBody.innerHTML = '';

    for (let i = 3; i < 12; i += 4) {
      const row = document.createElement('tr');
      for (let j = 0; j < 4; j++) {
        const index = i + j;
        if (index >= articlesData.length) break;

        const article = articlesData[index];
        const cell = document.createElement('td');
        const imageUrl = article.urlToImage ? article.urlToImage : 'img/newss.jpg';
        cell.innerHTML = `
          <div class="card">
            <img class="card-img-top" src="${imageUrl}" alt="Image">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description}</p>
              <a href="${article.url}" class="btn btn-primary" target="_blank">Leggi di più</a>
              <img class="favorite-icon" src="img/heart.svg" alt="Preferito" data-article-id="${article.id}">
            </div>
          </div>
        `;
        row.appendChild(cell);
      }
      newsTableBody.appendChild(row);
    }
  }

 
  function searchNews(searchText) {
    fetch(`https://newsapi.org/v2/top-headlines?q=${searchText}&apiKey=abfd3144841645a5b3de4fc3a81cff8e`)
      .then(response => response.json())
      .then(data => {
        populateCarousel(data.articles); 
        populateNews(data.articles); 
      })
      .catch(error => console.error('Errore nel recupero delle notizie:', error));
  }

 
  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchText = document.getElementById('txtsearch').value.trim();
    if (searchText) {
      searchNews(searchText);
    } else {
      fetch('https://newsapi.org/v2/top-headlines?country=it&apiKey=abfd3144841645a5b3de4fc3a81cff8e')
        .then(response => response.json())
        .then(data => {
          populateCarousel(data.articles); 
          populateNews(data.articles); 
        })
        .catch(error => console.error('Errore nel recupero delle notizie:', error));
    }
  });

  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const category = this.getAttribute('data-category');
      fetch(`https://newsapi.org/v2/top-headlines?q=${category}&apiKey=abfd3144841645a5b3de4fc3a81cff8e`)
        .then(response => response.json())
        .then(data => {
          populateCarousel(data.articles); 
          populateNews(data.articles); 
        })
        .catch(error => console.error('Errore nel recupero delle notizie:', error));
    });
  });

 
  fetch('https://newsapi.org/v2/top-headlines?country=it&apiKey=abfd3144841645a5b3de4fc3a81cff8e')
    .then(response => response.json())
    .then(data => {
      articles = data.articles;
      populateCarousel(articles);
      populateNews(articles);
    })
    .catch(error => console.error('Errore nel recupero delle notizie:', error));
});

function updateFavorites(article) {
  const index = favorites.findIndex(favorite => favorite && favorite.title === article.title);
  if (index === -1) {
    favorites.push(article);
    console.log('Articolo aggiunto ai preferiti:', article.title);
  } else {
    favorites.splice(index, 1);
    console.log('Articolo rimosso dai preferiti:', article.title);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log(favorites);
}



function showFavorites() {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (storedFavorites === null || storedFavorites.length === 0) {
    newsContainer.innerHTML = '<div class="col"><p class="text-center">Nessuna news preferita</p></div>';
  } else {
    populateFavorites(storedFavorites);
  }
}



document.addEventListener('click', function (event) {
  if (event.target.classList.contains('favorite-icon')) {
    const articleCard = event.target.closest('.card');
    const articleTitleElement = articleCard.querySelector('.card-title');
    if (articleTitleElement) {
      const articleTitle = articleTitleElement.textContent;
      const isFavorite = event.target.src.includes('heart-fill.svg');

      const article = articles.find(article => article.title === articleTitle);
      if (article) {
        const index = favorites.findIndex(favorite => favorite.title === articleTitle);

        if (isFavorite) {
          event.target.src = 'img/heart.svg';

          if (index !== -1) {

            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Articolo rimosso dai preferiti:', articleTitle);
          }
        } 
        else {
          event.target.src = 'img/heart-fill.svg';

          if (index === -1) {
            updateFavorites(article);
            console.log('Articolo aggiunto ai preferiti:', article.title);
          }
        }
      } else {
        console.error('Articolo non trovato:', articleTitle);
      }
    } else {
      console.error('Elemento del titolo dell\'articolo non trovato');
    }
  }
});


favoritesLink.addEventListener('click', function (event) {
  event.preventDefault();
  showFavorites();
});
function populateFavorites(articlesData) {
  newsContainer.innerHTML = '';
  carouselInner.innerHTML = '';
  newsTableBody.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Ecco qui i tuoi preferiti:';
  newsContainer.appendChild(title);


  articlesData.forEach(article => {
    const imageUrl = article.urlToImage ? article.urlToImage : 'img/def.jpg';
    const card = `
      <div class="col-md-3">
        <div class="card">
          <img class="card-img-top" src="${imageUrl}" alt="Image">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text">${article.description}</p>
            <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
            <img class="favorite-icon" src="img/heart-fill.svg" alt="Favorite">
          </div>
        </div>
      </div>
    `;
    newsContainer.insertAdjacentHTML('beforeend', card);
  });
}


function updateFavorites(article) {
  const index = favorites.findIndex(favorite => favorite && favorite.title === article.title);
  if (index === -1) {
    favorites.push(article);
    console.log('Articolo aggiunto ai preferiti:', article.title);
  } else {
    favorites.splice(index, 1);
    console.log('Articolo rimosso dai preferiti:', article.title);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log(favorites);
}




function showFavorites() {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (storedFavorites === null || storedFavorites.length === 0) {
    newsContainer.innerHTML = '<div class="col"><p class="text-center">Nessuna news preferita</p></div>';
  } else {
    populateFavorites(storedFavorites);
  }
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('favorite-icon')) {
    const articleCard = event.target.closest('.card');
    const articleTitleElement = articleCard.querySelector('.card-title');

    if (articleTitleElement) {
      const articleTitle = articleTitleElement.textContent;
      const isFavorite = event.target.src.includes('heart-fill.svg');

      const article = articles.find(article => article.title === articleTitle);

      if (article) {
        const index = favorites.findIndex(favorite => favorite.title === articleTitle);

        if (isFavorite) {
          event.target.src = 'img/heart.svg';  
          if (index !== -1) {
            favorites.splice(index, 1);
           
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Articolo rimosso dai preferiti:', articleTitle);
          }
        } 
        else {
        
          event.target.src = 'img/heart-fill.svg';

          if (index === -1) {
            updateFavorites(article);
            console.log('Articolo aggiunto ai preferiti:', article.title);
          }
        }
      } else {
        console.error('Articolo non trovato:', articleTitle);
      }
    } else {
      console.error('Elemento del titolo dell\'articolo non trovato');
    }
  }
});



favoritesLink.addEventListener('click', function (event) {
  event.preventDefault();
  showFavorites();
});
function populateFavorites(articlesData) {
  newsContainer.innerHTML = '';
  carouselInner.innerHTML = '';
  newsTableBody.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Ecco qui i tuoi preferiti:';
  newsContainer.appendChild(title);


  articlesData.forEach(article => {
    const imageUrl = article.urlToImage ? article.urlToImage : 'img/def.jpg';
    const card = `
      <div class="col-md-3">
        <div class="card">
          <img class="card-img-top" src="${imageUrl}" alt="Image">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text">${article.description}</p>
            <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
            <img class="favorite-icon" src="img/heart-fill.svg" alt="Favorite">
          </div>
        </div>
      </div>
    `;
    newsContainer.insertAdjacentHTML('beforeend', card);
  });
}
















