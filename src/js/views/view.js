import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received data to the DOM
   * @param {Object | Object[]} data data to be rendered in the DOM (e.g Recicpe)
   * @param {Boolean} [render=true] if false create markup string without render it
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View instant
   */

  render(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newElement, elementIndex) => {
      const currElement = currElements[elementIndex];

      // Update changed text
      if (
        !newElement.isEqualNode(currElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currElement.textContent = newElement.textContent;
      }

      // Update changed attributes
      if (!newElement.isEqualNode(currElement)) {
        Array.from(newElement.attributes).forEach(attribute => {
          currElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
              <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage, render = true) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
