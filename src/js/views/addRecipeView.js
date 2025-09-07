import icons from 'url:../../img/icons.svg';
import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.add-recipe-window');

  _form = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _generateMarkup() {}

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  showTempError(msg, sec) {
    this._parentElement.querySelector('.spinner')?.remove();

    const errorEl = this._parentElement.querySelector('.error');

    errorEl.querySelector('p').innerHTML = msg;

    this._form.classList.add('hide-form');
    errorEl.classList.remove('hide-form');

    setTimeout(() => {
      this._form.classList.remove('hide-form');
      this._parentElement.querySelector('.error').classList.add('hide-form');
    }, sec * 1000);
  }

  showSpinner(sec) {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._parentElement.insertAdjacentHTML('beforeend', markup);

    setTimeout(() => {
      this._parentElement.querySelector('.spinner')?.remove();
    }, sec * 1000);
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._form.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new AddRecipeView();
