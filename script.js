// JavaScript code for movie list application

const apiKey = "b3b26f05";
const apiUrl = "http://www.omdbapi.com/";

const movieListElement = document.getElementById("movieList");
const paginationElement = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const movieDetailsElement = document.getElementById("movieDetails");
const ratingAndCommentsElement = document.getElementById("ratingAndComments");
const commentInput = document.getElementById("commentInput");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");

let currentPage = 1;
let totalResults = 0;
let movies = [];

// Function to fetch movie data from the OMDB API
async function fetchMovies(page, searchTerm = "") {
  const response = await fetch(`${apiUrl}?apikey=${apiKey}&s=${searchTerm}&page=${page}`);
  const data = await response.json();
  return data;
}

// Function to render the movie list on the page
function renderMovieList() {
  movieListElement.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
    `;

    // Click event to show movie details and ratings/comments form
    movieCard.addEventListener("click", () => {
      showMovieDetails(movie);
    });

    movieListElement.appendChild(movieCard);
  });
}

// Function to show movie details and ratings/comments form
function showMovieDetails(movie) {
  const movieDetails = `
    <h2>${movie.Title}</h2>
    <p>Year: ${movie.Year}</p>
    <p>Genre: ${movie.Genre}</p>
    <p>Plot: ${movie.Plot}</p>
  `;

  movieDetailsElement.innerHTML = movieDetails;
  movieDetailsElement.style.display = "block";
  ratingAndCommentsElement.style.display = "block";
}

// Function to handle pagination
function handlePagination() {
  const totalPages = Math.ceil(totalResults / 10);

  paginationElement.innerHTML = "";

  if (totalPages > 1) {
    const previousButton = createPaginationButton("Previous", currentPage > 1 ? currentPage - 1 : currentPage);
    paginationElement.appendChild(previousButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = createPaginationButton(i, i);
      paginationElement.appendChild(pageButton);
    }

    const nextButton = createPaginationButton("Next", currentPage < totalPages ? currentPage + 1 : currentPage);
    paginationElement.appendChild(nextButton);
  }
}

// Function to create pagination buttons
function createPaginationButton(text, page) {
  const button = document.createElement("button");
  button.innerText = text;
  button.addEventListener("click", () => {
    currentPage = page;
    fetchAndRenderMovies();
  });
  return button;
}

// Function to submit user rating and comment
function submitRatingAndComment() {
  const selectedRating = document.querySelector("input[name='rating']:checked");
  const ratingValue = selectedRating ? selectedRating.value : null;
  const commentValue = commentInput.value.trim();

  // Store rating and comment in local storage
  if (ratingValue && commentValue) {
    // You can modify the movie object to include the rating and comment properties
    // before saving it in the local storage based on your data structure
    const movie = {
      rating: ratingValue,
      comment: commentValue
    };

    // Save the movie object in local storage
    localStorage.setItem("movieRatingComment", JSON.stringify(movie));

    // Clear rating and comment inputs
    selectedRating.checked = false;
    commentInput.value = "";

    // Show success message (you can customize this as well)
    alert("Rating and comment submitted successfully!");

    // Display rating and comment in a pop-up
    displayRatingAndCommentPopup(movie);
  } else {
    alert("Please provide both rating and comment.");
  }
}

// Function to fetch movies and render the list
async function fetchAndRenderMovies() {
  const searchTerm = searchInput.value.trim();
  const data = await fetchMovies(currentPage, searchTerm);

  if (data.Response === "True") {
    movies = data.Search;
    totalResults = parseInt(data.totalResults);
    renderMovieList();
    handlePagination();
  } else {
    // Handle error - no results or API request failure
    movieListElement.innerHTML = "No movies found.";
    paginationElement.innerHTML = "";
  }
}

// Function to display rating and comment in a pop-up
function displayRatingAndCommentPopup(movie) {
  const popupContent = document.createElement("div");
  popupContent.innerHTML = `
    <h2>${movie.Title}</h2>
    <p>Rating: ${movie.rating}/5</p>
    <p>Comment: ${movie.comment}</p>
  `;

  const closeBtn = document.createElement("div");
  closeBtn.classList.add("close-btn");
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", closePopup);

  popup.innerHTML = "";
  popup.appendChild(popupContent);
  popup.appendChild(closeBtn);

  overlay.style.display = "block";
  popup.style.display = "block";
}

// Function to close the pop-up
function closePopup() {
  overlay.style.display = "none";
  popup.style.display = "none";
}

// Event listener for search input
searchInput.addEventListener("input", () => {
  currentPage = 1;
  fetchAndRenderMovies();
});

// Initial fetch and render
fetchAndRenderMovies();
