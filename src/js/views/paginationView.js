import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // First page
    if (currPage === 1 && numPages > 1) {
      return this._createMarkupNxtPage(currPage);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._createMarkupPrePage(currPage);
    }

    // Middle page
    if (currPage < numPages) {
      return `${this._createMarkupPrePage(currPage)}${this._createMarkupNxtPage(
        currPage
      )}`;
    }

    // Only one page
    return '';
  }

  _createMarkupPrePage(currPage) {
    const prePage = currPage - 1;
    return `
      <button data-goto="${prePage}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${prePage}</span>
      </button>
    `;
  }

  _createMarkupNxtPage(currPage) {
    const nxtPage = currPage + 1;
    return `
      <button data-goto="${nxtPage}" class="btn--inline pagination__btn--next">
        <span>Page ${nxtPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
