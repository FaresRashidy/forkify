// Import npm packages
import 'core-js/stable';
import 'regenerator-runtime';

// Import project's js files
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC, MODEL_SHOW_ERROR_SEC } from './config.js';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show spinner till data arrive
    recipeView.renderSpinner();

    // Loading recipes from model.js
    await model.loadRecipe(id);

    // Update results view (search) to make selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Update bookmark view
    bookmarksView.update(model.state.bookmarks);

    // Rendering recipes from recipeView.js
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Show spinner till data arrive
    resultsView.renderSpinner();

    // Get search input field from the DOM
    const query = searchView.getQuery();
    if (!query) return;

    // Loading recipes from model.js
    await model.loadSearchResults(query);

    // First show page 1 results
    resultsView.render(model.getSearchResultsPage());

    // First render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render new pagination resultes
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmarks to state.bookmarks
  if (model.state.recipe?.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  // Update recipe view for the bookmnark icon
  recipeView.update(model.state.recipe);

  // Render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner for x sec
    addRecipeView.showSpinner(MODEL_CLOSE_SEC);

    // POST a new recipe
    await model.uploadRecipe(newRecipe);

    // Render the new recipe to recipe view
    recipeView.render(model.state.recipe);

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window after x sec
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    // show error for x sec and show the form again
    addRecipeView.showTempError(error.message, MODEL_SHOW_ERROR_SEC);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
