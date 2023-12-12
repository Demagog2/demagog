import * as React from 'react';

import { kebabCase, orderBy } from 'lodash';
import memoize from 'memoize-one';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import { css, cx } from 'emotion';
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';

import nfnzLogo from './nfnz-logo.svg';
import programoveProhlaseniCerven2018 from './Programove-prohlaseni-vlady-cerven-2018.pdf';
import vladniSlibyLogo from './vladni-sliby-logo.svg';

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface IProps {
  statements: Array<{
    id: number;
    title: string;
    page: number;
    permalink: string;
    position: [number, number, number, number] | null;
    promise_rating_key: string;
    short_explanation: string;
  }>;
}

interface IState {
  documentPage: number;
  selectedStatementId: number | null;
}

export default class PromisesDocumentApp extends React.Component<IProps, IState> {
  public state = {
    documentPage: 1,
    selectedStatementId: null,
  };

  public pagesListRef = React.createRef();
  public memoizedPages = {};

  public render() {
    const { statements } = this.props;
    const { documentPage, selectedStatementId } = this.state;

    return (
      <div
        className={css`
          width: 100vw;
          height: 100vh;
          min-width: 860px;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          className={css`
            flex: 0 0 70px;
            width: 100%;
            border-bottom: 2px solid #d8e1e8;
          `}
        >
          <div
            className={css`
              max-width: 1200px;
              height: 100%;
              margin: 0 auto;
            `}
          >
            <HeaderBar />
          </div>
        </div>
        <div
          className={css`
            flex: 1 0 0;
            display: flex;
            flex-direction: row;
            width: 100%;
            max-width: 1200px;
          `}
        >
          <div
            className={css`
              flex: 65 0 0;
              height: 100%;
              position: relative;
            `}
          >
            <Document file={programoveProhlaseniCerven2018}>
              <div
                className={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                `}
              >
                <AutoSizer>
                  {({ height, width }) => {
                    const pageWidth = width - 40; // 15px left margin, 25px right margin
                    const pageHeight = Math.ceil((pageWidth / 210) * 297) + 8; // A4 scale, 8px bottom margin
                    const verticalPaddingSize = 15;
                    const innerElementType = (React.forwardRef as any)(
                      ({ style, ...rest }, ref) => (
                        <div
                          ref={ref}
                          style={{
                            ...style,
                            height: `${parseFloat(style.height) + verticalPaddingSize * 2}px`,
                          }}
                          {...rest}
                        />
                      ),
                    );

                    return (
                      <FixedSizeList
                        ref={this.pagesListRef}
                        height={height}
                        innerElementType={innerElementType}
                        itemCount={44}
                        itemSize={pageHeight}
                        onItemsRendered={this.handlePagesListItemsRendered}
                        width={width}
                      >
                        {({ index, style }) => {
                          const pageNumber = index + 1;

                          return (
                            <div
                              style={{
                                ...style,
                                top: `${parseFloat(style.top) + verticalPaddingSize}px`,
                              }}
                            >
                              <div
                                className={css`
                                  width: ${pageWidth}px;
                                  margin: 0 0 8px 15px;
                                  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
                                `}
                              >
                                {/* <Page
                                  onStatementHighlightClick={this.handleStatementHighlightClick}
                                  pageNumber={pageNumber}
                                  selectedStatementId={selectedStatementId}
                                  statements={statements}
                                  width={pageWidth}
                                /> */}
                                {/* {this.renderPage({
                                  pageNumber,
                                  selectedStatementId,
                                  statements,
                                  width: pageWidth,
                                })} */}
                                <ReactPdfPage
                                  pageNumber={pageNumber}
                                  width={pageWidth}
                                  customTextRenderer={this.pageTextRenderer(
                                    pageNumber,
                                    statements,
                                    selectedStatementId,
                                  )}
                                />
                              </div>
                            </div>
                          );
                        }}
                      </FixedSizeList>
                    );
                  }}
                </AutoSizer>
              </div>
            </Document>

            <div
              className={css`
                position: absolute;
                left: 50%;
                bottom: 15px;
                margin-left: -75px;
                width: 150px;
                height: 48px;
                background: #282828;
                color: white;
                display: flex;
                flex-direction: row;
              `}
            >
              <button
                type="button"
                onClick={this.handlePageUp}
                className={css`
                  flex: 0 0 45px;
                  align-self: stretch;
                  margin: 0;
                  padding: 0;
                  border: none;
                  background: none;
                  cursor: pointer;
                  outline: none;

                  &:hover,
                  &:active {
                    opacity: 0.7;
                  }
                `}
              >
                <img
                  src={
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAAXNSR0IArs4c6QAAAJxJREFUKBWFkMsNgzAQRH0kjVEAR3IByklJaYgmCOaN5ZUcsuuMNFrj+dg4pQ5yzqPYscQSwQV+KpfY6SiE1hpkFKhoday/WzJCBe74X0IiCltZXIJjg/eT3+yJLU4+vn+HDYUltFBwgA/olWzlARDDsL1QtwRxhy3KyRa2icG7yZ4QnvCoDW44KFFmLhqLCb7gYOZo4tFN5J3kuQD0ymxIgTo9VgAAAABJRU5ErkJggg=='
                  }
                  alt={'O stránku zpět'}
                />
              </button>
              <div
                className={css`
                  flex: 1 1 auto;
                  margin-top: -3px;
                  align-self: center;
                  text-align: center;
                `}
              >
                {documentPage} / 44
              </div>
              <button
                type="button"
                onClick={this.handlePageDown}
                className={css`
                  flex: 0 0 45px;
                  align-self: stretch;
                  margin: 0;
                  padding: 0;
                  border: none;
                  background: none;
                  cursor: pointer;
                  outline: none;

                  &:hover,
                  &:active {
                    opacity: 0.7;
                  }
                `}
              >
                <img
                  src={
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAAXNSR0IArs4c6QAAAI5JREFUKBWVUEEOgCAMI/zAT3jBBxve5Y27iX4CW0MjmqG4pHRja4e6nLMHZmABRvcRnCmz1HiHIwKKFUnThD2AM4pIg6SqsGmC3lPM8USDCdhZVXEzwb0lpmY6v5gJYJp8ivXPXkz4mjquzRKLMWW9pE/cYdLeLLEYKwOwVauZB/W7uDL5L9YGmAyEaosPBztySJwi3hIAAAAASUVORK5CYII='
                  }
                  alt={'O stránku dál'}
                />
              </button>
            </div>
          </div>
          <div
            className={css`
              flex: 35 0 0;
              height: 100%;
              overflow-x: hidden;
              overflow-y: auto;
              padding: 0 15px 0 10px;
            `}
          >
            <div
              className={css`
                padding: 15px 0;
                width: 100%;
              `}
            >
              <StatementsList
                statements={statements}
                selectedStatementId={selectedStatementId}
                onStatementSelect={this.handleListStatementSelect}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // public renderPage = ({ pageNumber, selectedStatementId, statements, width }) => {
  //   if (this.memoizedPages[pageNumber]) {
  //     this.memoizedPages[pageNumber] = memoize();
  //   }

  //   return (
  // <ReactPdfPage
  //   pageNumber={pageNumber}
  //   width={width}
  //   customTextRenderer={this.pageTextRenderer(pageNumber, statements, selectedStatementId)}
  // />
  //   );
  // };

  public handleListStatementSelect = (statement) => {
    this.setState({ selectedStatementId: statement.id });

    const documentPage = statement.page;

    if (this.pagesListRef.current !== null) {
      (this.pagesListRef.current as FixedSizeList).scrollToItem(documentPage - 1, 'start');
    }
  };

  public handleStatementHighlightClick = (statement) => {
    this.setState({ selectedStatementId: statement.id });
  };

  public handlePagesListItemsRendered = ({ visibleStartIndex }) => {
    const documentPage = visibleStartIndex + 1;

    if (this.state.documentPage !== documentPage) {
      this.setState({ documentPage });
    }
  };

  public handlePageUp = () => {
    const documentPage = this.state.documentPage - 1;

    if (this.pagesListRef.current !== null) {
      (this.pagesListRef.current as FixedSizeList).scrollToItem(documentPage - 1, 'start');
    }
  };

  public handlePageDown = () => {
    const documentPage = this.state.documentPage + 1;

    if (this.pagesListRef.current !== null) {
      (this.pagesListRef.current as FixedSizeList).scrollToItem(documentPage - 1, 'start');
    }
  };

  public pageTextRenderer = memoize((pageNumber, statements, selectedStatementId) => (textItem) => {
    // const contentPageNumber = realPageNumber - 4;

    // if (contentPageNumber === 14) {
    //   // tslint:disable-next-line:no-console
    //   console.log('=======', {
    //     itemIndex: textItem.itemIndex,
    //     str: textItem.str,
    //     other: {
    //       strLength: textItem.str.length,
    //       str10: textItem.str.substring(10),
    //       str20: textItem.str.substring(20),
    //       str30: textItem.str.substring(30),
    //       str40: textItem.str.substring(40),
    //       str50: textItem.str.substring(50),
    //     },
    //   });
    // }

    return highlightStatement(
      pageNumber,
      textItem,
      statements,
      selectedStatementId,
      this.handleStatementHighlightClick,
    );
  });
}

// interface IPageProps {
//   onStatementHighlightClick: (statement: any) => void;
//   pageNumber: number;
//   selectedStatementId: number | null;
//   statements: any[];
//   width: number;
// }

// class Page extends React.Component<any> {
//   public render() {
//     return (

//     )
//   }
// }

// const Page = React.memo(
//   ({
//     onStatementHighlightClick,
//     pageNumber,
//     selectedStatementId,
//     statements,
//     width,
//   }: IPageProps) => {
//     console.log('rerender', { pageNumber });
//     return (
//       <ReactPdfPage
//         pageNumber={pageNumber}
//         width={width}
//         customTextRenderer={(textItem) =>
//           highlightStatement(
//             pageNumber,
//             textItem,
//             statements,
//             selectedStatementId,
//             onStatementHighlightClick,
//           )
//         }
//       />
//     );
//   },
// );

const highlightStatement = (
  contentPageNumber,
  textItem,
  statements,
  selectedStatementId,
  onStatementClick,
) => {
  const matched = statements.filter(
    (statement) =>
      statement.page === contentPageNumber &&
      statement.position !== null &&
      textItem.itemIndex >= statement.position[0] &&
      textItem.itemIndex <= statement.position[2],
  );
  if (matched.length === 0) {
    return textItem.str;
  }

  const StatementMark = ({ children, statement }) => (
    <mark
      className={css`
        cursor: pointer;
        background-color: ${selectedStatementId === statement.id ? '#ffd1c2' : '#ffffae'};

        /* &:hover {
          background-color: #ffd200;
        } */
      `}
      onClick={() => onStatementClick(statement)}
    >
      {children}
    </mark>
  );

  const stack = orderBy(matched, ['page', 'position.0'], ['asc', 'asc']);
  const result: React.ReactNode[] = [];
  let lastPos = 0;

  if (stack[0].position[0] < textItem.itemIndex && stack[0].position[2] === textItem.itemIndex) {
    result.push(
      <StatementMark key={result.length} statement={stack[0]}>
        {textItem.str.substring(0, stack[0].position[3])}
      </StatementMark>,
    );
    lastPos = stack[0].position[3];
    stack.shift();
  } else if (
    stack[0].position[0] < textItem.itemIndex &&
    stack[0].position[2] > textItem.itemIndex
  ) {
    result.push(
      <StatementMark key={result.length} statement={stack[0]}>
        {textItem.str}
      </StatementMark>,
    );
    lastPos = textItem.str.length;
    stack.shift();
  }

  stack.forEach((statement) => {
    if (statement.position[0] === textItem.itemIndex && lastPos < statement.position[1]) {
      result.push(
        <React.Fragment key={result.length}>
          {textItem.str.substring(lastPos, statement.position[1])}
        </React.Fragment>,
      );
      lastPos = statement.position[1];
    }

    if (statement.position[2] === textItem.itemIndex) {
      result.push(
        <StatementMark key={result.length} statement={statement}>
          {textItem.str.substring(statement.position[1], statement.position[3])}
        </StatementMark>,
      );
      lastPos = statement.position[3];
    } else {
      result.push(
        <StatementMark key={result.length} statement={statement}>
          {textItem.str.substring(statement.position[1])}
        </StatementMark>,
      );
      lastPos = textItem.str.length;
    }
  });

  if (lastPos < textItem.str.length) {
    result.push(
      <React.Fragment key={result.length}>{textItem.str.substring(lastPos)}</React.Fragment>,
    );
  }

  return result;
};

class StatementsList extends React.Component<any> {
  public refs: Record<number, Element> = {};

  public componentDidUpdate(prevProps) {
    if (
      prevProps.selectedStatementId !== this.props.selectedStatementId &&
      this.props.selectedStatementId !== null
    ) {
      const statementEl = this.refs[this.props.selectedStatementId];

      if (statementEl) {
        statementEl.scrollIntoView();
      }
    }
  }

  public saveRef = (statement, el) => {
    this.refs = { ...this.refs, [statement.id]: el };
  };

  public render() {
    const { onStatementSelect, statements, selectedStatementId } = this.props;
    return (
      <>
        {statements.map((statement) => {
          const isSelected = selectedStatementId === statement.id;

          return (
            <div
              key={statement.id}
              ref={(el) => {
                this.saveRef(statement, el);
              }}
              className={css`
                display: flex;
                background-color: ${isSelected ? '#FAE4DD' : 'transparent'};
                cursor: ${isSelected ? 'default' : 'pointer'};

                &:hover {
                  background-color: ${isSelected ? '#FAE4DD' : '#e7f0f6'};
                }
              `}
              onClick={() => onStatementSelect(statement)}
            >
              <div
                className={css`
                  flex: 0 0 65px;
                  padding: 12px 0;
                  margin-right: 5px;
                  text-align: center;
                `}
              >
                <button
                  type="button"
                  className={css`
                    border: none;
                    background: none;
                    margin: 0;
                    padding: 0;
                    font-family: Lato, sans-serif;
                    font-size: 16px;
                    line-height: 1.25;
                    font-weight: normal;
                    color: #f26538;
                    cursor: pointer;
                    text-decoration: none;
                    outline: none;

                    &:hover,
                    &:active {
                      text-decoration: underline;
                    }
                  `}
                  onClick={() => onStatementSelect(statement)}
                >
                  str. {statement.page}
                </button>
              </div>
              <div
                className={css`
                  flex: 1 1 auto;
                  padding: 12px 0;
                `}
              >
                <h3
                  className={css`
                    font-family: Lato, sans-serif;
                    font-size: 16px;
                    line-height: 1.25;
                    font-weight: bold;
                    color: #3c325c;
                    margin: 0;
                  `}
                >
                  {statement.title}
                </h3>
                <div
                  className={css`
                    margin-top: 7px;
                  `}
                >
                  <span
                    className={cx('promise-evaluation', kebabCase(statement.promise_rating_key))}
                  >
                    {
                      {
                        fulfilled: 'splněný slib',
                        in_progress: 'rozpracovaný slib',
                        broken: 'porušený slib',
                        stalled: 'nerealizovaný slib',
                      }[statement.promise_rating_key]
                    }
                  </span>
                </div>
                {isSelected && (
                  <>
                    <p
                      className={css`
                        color: #3c325c;
                        margin: 4px 15px 5px 0;
                      `}
                    >
                      {statement.short_explanation}
                    </p>
                    <div
                      className={css`
                        margin: 0 15px 10px 0;
                      `}
                    >
                      <a href={statement.permalink} target="_blank" rel="noreferrer">
                        na detail slibu s celým odůvodněním →
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

const HeaderBar = () => {
  return (
    <div
      className={css`
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
    >
      <a
        href="/"
        className={css`
          margin-left: 15px;
        `}
      >
        <img
          src={
            'data:image/png;base64,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'
          }
          alt="Demagog.cz"
        />
      </a>
      <img
        src={vladniSlibyLogo}
        alt="Vládní sliby"
        className={css`
          width: 110px;
          margin: -2px 0 0 15px;
        `}
      />
      <div
        className={css`
          flex: 1 1 auto;
          text-align: center;
        `}
      >
        <h1
          className={css`
            margin: 0;
            font-size: 18px;
            line-height: 1.25;
            font-weight: bold;
            color: #3c325c;
          `}
        >
          Programové prohlášení druhé vlády Andreje Babiše (
          <a
            href={
              'https://www.vlada.cz/assets/jednani-vlady/programove-prohlaseni/Programove-prohlaseni-vlady-cerven-2018.pdf'
            }
            target="_blank"
            rel="noreferrer"
          >
            zdroj
          </a>
          )
        </h1>
        <h2
          className={css`
            margin: 4px 0 0 0;
            font-size: 16px;
            line-height: 1.25;
            font-weight: normal;
            color: #3c325c;
          `}
        >
          se zvýrazněnými sliby z projektu{' '}
          <a href="/sliby/druha-vlada-andreje-babise">Sliby vlády Andreje Babiše</a> od Demagog.cz
        </h2>
      </div>

      <div
        className={css`
          margin-right: 15px;
          text-align: right;
          font-size: 14px;
        `}
      >
        Vzniklo díky
        <br /> podpoře:
      </div>

      <a
        href="https://www.darujme.cz/projekt/1200037"
        className={css`
          width: 110px;
          font-weight: bold;
          margin-right: 15px;
        `}
        title="Nadační fond nezávislé žurnalistiky"
      >
        <img src={nfnzLogo} alt="Nadační fond nezávislé žurnalistiky" />
      </a>
    </div>
  );
};
