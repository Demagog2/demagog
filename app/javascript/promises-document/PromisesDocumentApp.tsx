import * as React from 'react';

import { css, cx } from 'emotion';
import { groupBy } from 'lodash';
import memoize from 'memoize-one';
import handleViewport from 'react-in-viewport';
import { Document, Page, pdfjs } from 'react-pdf';

import programoveProhlaseniUnor2014 from './programove_prohlaseni_unor_2014.pdf';

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface IPromise {
  id: number;
  name: string;
  veracity_key: 'true' | 'untrue' | 'misleading';
  explanation_html: string;
  page: number | null;
  position: number[] | null;
}

interface IProps {
  promises: IPromise[];
}

interface IState {
  numPages: number | null;
  pageNumber: number;
  // width: number | null;
  selectedPromiseId: number | null;
}

export default class PromisesDocumentApp extends React.Component<IProps, IState> {
  public state = {
    numPages: 51,
    pageNumber: 1,
    // width: null,
    selectedPromiseId: null,
  };
  public pdfContainer;

  public componentDidMount() {
    // this.setDivSize();
    // window.addEventListener('resize', throttle(this.setDivSize, 500));
    this.handleHashChange();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  public componentWillUnmount() {
    // window.removeEventListener('resize', throttle(this.setDivSize, 500));
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  // public setDivSize = () => {
  //   this.setState({ width: this.pdfContainer.getBoundingClientRect().width });
  // };

  public handleHashChange = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#slib([0-9]+)$/);

    this.setState({ selectedPromiseId: match !== null ? parseInt(match[1], 10) : null });
  };

  public onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  public toggleSelectedPromiseId = (promiseId: number) => {
    this.setState(
      {
        selectedPromiseId: this.state.selectedPromiseId === promiseId ? null : promiseId,
      },
      () => {
        const hash =
          this.state.selectedPromiseId !== null ? `#slib${this.state.selectedPromiseId}` : '';

        history.pushState(undefined, '', window.location.pathname + hash);
      },
    );
  };

  public render() {
    const { promises } = this.props;
    const { numPages, selectedPromiseId } = this.state;

    const pageNumbers = Array(numPages)
      .fill(null)
      .map((_, i) => i + 1);

    return (
      <Document file={programoveProhlaseniUnor2014} onLoadSuccess={this.onDocumentLoadSuccess}>
        {pageNumbers.map((pageNumber) => (
          <ViewportPageWithPromises
            key={pageNumber}
            pageNumber={pageNumber}
            promises={promises}
            toggleSelectedPromiseId={this.toggleSelectedPromiseId}
            selectedPromiseId={selectedPromiseId}
          />
        ))}
      </Document>
    );
  }
}

class PageWithPromises extends React.Component<any> {
  public getPagePromises = memoize((promises, pageNumber) => {
    const promisesByPage = groupBy(promises, 'page');
    return promisesByPage[pageNumber] || [];
  });

  public pageTextRenderer = memoize((pageNumber, pagePromises, selectedPromiseId) => (textItem) => {
    if (pageNumber === null) {
      // tslint:disable-next-line:no-console
      console.log('=======', { itemIndex: textItem.itemIndex, str: textItem.str });
    }

    return highlightPromise(
      textItem,
      pagePromises,
      selectedPromiseId,
      this.handlePromiseHighlightClick,
    );
  });

  public handlePromiseHighlightClick = (promise) => {
    this.props.toggleSelectedPromiseId(promise.id);
  };

  public render() {
    const {
      inViewport,
      innerRef,
      pageNumber,
      promises,
      toggleSelectedPromiseId,
      selectedPromiseId,
    } = this.props;

    const pagePromises = this.getPagePromises(promises, pageNumber);

    let pagePromisesSelectedPromiseId = null;
    pagePromises.forEach((promise) => {
      if (promise.id === selectedPromiseId) {
        pagePromisesSelectedPromiseId = selectedPromiseId;
      }
    });

    return (
      <div
        ref={innerRef}
        style={{ width: '992px', height: '1052px', marginBottom: 5 }} // (744/75)*100 = 992
      >
        <div style={{ display: 'flex' }}>
          <div
            className={css`
              flex: 0 0 75%;
              background: white;
              height: 100%;
            `}
          >
            {inViewport && (
              <Page
                pageNumber={pageNumber}
                customTextRenderer={this.pageTextRenderer(
                  pageNumber,
                  pagePromises,
                  pagePromisesSelectedPromiseId,
                )}
                width={744}
              />
            )}
          </div>
          {pagePromises !== undefined && (
            <div
              className={css`
                flex: 0 0 25%;
                position: relative;
              `}
            >
              {pagePromises.map((promise) => (
                <div
                  key={promise.id}
                  id={'slib' + promise.id}
                  className={css`
                    position: absolute;
                    left: 0;
                    right: 0;
                  `}
                  style={{ top: promise.position[4] + '%' }}
                >
                  <PromiseBox
                    promise={promise}
                    selected={selectedPromiseId === promise.id}
                    onClick={() => toggleSelectedPromiseId(promise.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const ViewportPageWithPromises = (handleViewport as any)(PageWithPromises);

const highlightPromise = (textItem, pagePromises, selectedPromiseId, onPromiseClick) => {
  const matched = pagePromises.filter(
    (promise) =>
      promise.position !== null &&
      textItem.itemIndex >= promise.position[0] &&
      textItem.itemIndex <= promise.position[2],
  );
  if (matched.length === 0) {
    return textItem.str;
  }

  const matchedPromise = matched[0];

  const PromiseMark = ({ children }) => (
    <mark
      className={css`
        cursor: pointer;
        background-color: ${selectedPromiseId === matchedPromise.id ? '#ffab7c' : 'yellow'};

        /* &:hover {
          background-color: #ffd200;
        } */
      `}
      onClick={() => onPromiseClick(matchedPromise)}
    >
      {children}
    </mark>
  );

  if (matchedPromise.position[0] === textItem.itemIndex) {
    return [
      <React.Fragment key={textItem.itemIndex + '-0'}>
        {textItem.str.substr(0, matchedPromise.position[1])}
      </React.Fragment>,
      <PromiseMark key={textItem.itemIndex + '-1'}>
        {textItem.str.substr(matchedPromise.position[1])}
      </PromiseMark>,
    ];
  }

  if (matchedPromise.position[2] === textItem.itemIndex) {
    return [
      <PromiseMark key={textItem.itemIndex + '-0'}>
        {textItem.str.substr(0, matchedPromise.position[3])}
      </PromiseMark>,
      <React.Fragment key={textItem.itemIndex + '-1'}>
        {textItem.str.substr(matchedPromise.position[3])}
      </React.Fragment>,
    ];
  }

  return <PromiseMark>{textItem.str}</PromiseMark>;
};

interface IPromiseBoxProps {
  promise: IPromise;
  selected: boolean;
  onClick: () => any;
}

class PromiseBox extends React.Component<IPromiseBoxProps> {
  public boxElement;

  public componentDidMount() {
    if (this.props.selected) {
      this.boxElement.scrollIntoView();
    }
  }

  public render() {
    const { promise, selected, onClick } = this.props;

    const baseClassName = css`
      border: 1px solid #c4d5f0;
      border-radius: 5px;
      cursor: pointer;
      position: absolute;
      right: 0;
      left: 20px;
      padding: 10px 15px;

      &:hover {
        border-color: var(--orange);
      }
    `;

    const selectedClassName = css`
      cursor: auto;
      left: -70px;
      background-color: white;
      z-index: 100;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);

      &:hover {
        border-color: #c4d5f0;
      }
    `;

    const handleClick = () => {
      if (!selected) {
        onClick();
      }
    };

    return (
      <div
        className={cx(baseClassName, { [selectedClassName]: selected })}
        onClick={handleClick}
        ref={(ref) => (this.boxElement = ref)}
      >
        {selected && (
          <button
            type="button"
            className={css`
              float: right;
              margin-left: 10px;

              background: none;
              border: none;
              font-size: 1rem;
              font-family: Lato, sans-serif;
              color: var(--orange);
              padding: 0;
              cursor: pointer;

              &:hover {
                text-decoration: underline;
              }
            `}
            onClick={onClick}
          >
            × zavřít
          </button>
        )}
        <strong>{promise.name}</strong>
        <div
          className={css`
            margin-top: 10px;
          `}
        >
          {promise.veracity_key === 'true' && (
            <div className="promise-item-badge fulfilled"> Splněný slib</div>
          )}
          {promise.veracity_key === 'misleading' && (
            <div className="promise-item-badge partially-fulfilled"> Část. splněný slib</div>
          )}
          {promise.veracity_key === 'untrue' && (
            <div className="promise-item-badge broken"> Porušený slib</div>
          )}
        </div>
        {selected && (
          <div
            className={css`
              overflow-y: auto;
              height: 400px;
              padding-right: 15px;
              margin: 15px -15px 5px 0;

              > div > iframe {
                width: 100%;
              }
            `}
          >
            <div dangerouslySetInnerHTML={{ __html: promise.explanation_html }} />
          </div>
        )}
      </div>
    );
  }
}
