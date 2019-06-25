import * as React from 'react';

import { kebabCase, orderBy } from 'lodash';
import memoize from 'memoize-one';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import { css, cx } from 'emotion';
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';

import programoveProhlaseniCerven2018 from './Programove-prohlaseni-vlady-cerven-2018.pdf';

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
                    // tslint:disable-next-line:max-line-length
                    `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAAXNSR0IArs4c6QAAAJxJREFUKBWFkMsNgzAQRH0kjVEAR3IByklJaYgmCOaN5ZUcsuuMNFrj+dg4pQ5yzqPYscQSwQV+KpfY6SiE1hpkFKhoday/WzJCBe74X0IiCltZXIJjg/eT3+yJLU4+vn+HDYUltFBwgA/olWzlARDDsL1QtwRxhy3KyRa2icG7yZ4QnvCoDW44KFFmLhqLCb7gYOZo4tFN5J3kuQD0ymxIgTo9VgAAAABJRU5ErkJggg==`
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
                    // tslint:disable-next-line:max-line-length
                    `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAAXNSR0IArs4c6QAAAI5JREFUKBWVUEEOgCAMI/zAT3jBBxve5Y27iX4CW0MjmqG4pHRja4e6nLMHZmABRvcRnCmz1HiHIwKKFUnThD2AM4pIg6SqsGmC3lPM8USDCdhZVXEzwb0lpmY6v5gJYJp8ivXPXkz4mjquzRKLMWW9pE/cYdLeLLEYKwOwVauZB/W7uDL5L9YGmAyEaosPBztySJwi3hIAAAAASUVORK5CYII=`
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

  // tslint:disable-next-line:member-ordering
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
  public refs: { [statementId: number]: Element } = {};

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
              ref={(el) => this.saveRef(statement, el)}
              className={css`
                display: flex;
                background-color: ${isSelected ? '#FAE4DD' : 'transparent'};

                &:hover {
                  background-color: ${isSelected ? '#FAE4DD' : '#e7f0f6'};
                }
              `}
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
                        in_progress: 'porušený slib',
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
                      <a href={statement.permalink} target="_blank">
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
            // tslint:disable-next-line:max-line-length
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAABadJREFUWAm1WGtsFFUUPndmdmef7T7sdrel0PKoIFIxaiRGfogiEQIBIwiWiE3wj8UAIdIUQkJo0pDKI2DwgfygJm2hbWqFVOQREJ8EJEAbBYQKUmlhl+2+d4bZ2RnPLOyy23bbQrc32c59nHO+c+8997v3lMBjlGAwaNc3VNvc7ec19LMvnwCP0yi574DsdwPRGkGXmw+8wdImXPpxg2nmAmC1G67AEiIMBkEGG4yPNcoy/ca2VVWECy7RcP4JgvsuRCQJh1E9ZuGhGVkGCqs0RYEqJw+oqNQaYPVNOZu/qY/b6vt9qNm3+1Hbt3t9qcp1q0r2OotELgSCjJgU/UggTU2ORsGoUQMnk4iky76ozc1fWzPvi3Obp6auSFoH/G21xfSFk5V8V+dyWpYYEWf3cLppIAfuVgBokEFnskJIpd9vrj5Yliw5oAOuykXFLJAj2rB3vD/MofqAYsl2hq7LEhhZFkKSXA9zyr60LCz7WVHqZ7ln04qp2kDPUYYP5fNRZdaZLTqGAv6pgv9OXGkoXNIE0RQHPG1106kzhw9Rrq4CBTxlMIN+aIgkRRj2O5MYfJdKtiv/fvgTnc9ZcH8UwRU8TiKUjsiLPGNKzicccO9at5ru7V7qwz0fzUIwovRqBgISdQ1ouiPmgP9Ei5V0d1bIokgBGaWFR94wqlVAGUyC/Pzrv0L+5NcsG/eVMspso+2nNxoinMMvKYc8sw7EiAlnTWebQNZnNZOSmY36d1Y1I04swin51CkN3PjTFuWCGQdnANmSojkxO/ckOMY8p5l2cKlp8cdNcXBl8oznwqFJaq2+NORGB5BCR1yQsFQ0ibElKSrxycHeRZYtjace2N3XzzxDfmoIiLkTMgJOkGyyDQbgafVVoeCZVm7KC3vy5yzr6oea1MHA/PKd0pnvsWsEe48BplN4X6ULSFmmddL0V1ssb69yJ+GkrTJaWVwYVMLhCfCV60FFJGCsNqAchcfpp2dsVc997yTAgbSAfQeYcCDQt2/YbQ3OOpJb9Js4ZvJmQ1nFcYDdw9aNC1LAxE5ivP1439hBQhWRfzy9JGlKb8nBZtxS0sgwqrwgAHXr8ivM338c47eXH/O2fD1rGGopIlQYmFakv5TO4TYULRHwdvO4QPqnY3b0dFOrULHgQ39tpXXYNjwL7YXEPvGGGFWeWCMrCs9n67TAU6qrgr2wVR5bsse6rHzQY0h6v9oyTX2ro52/8y9ywQjiIeE7EhESGkFKj+SM9ekdBZsis1ceME6a5EqIJFUoc/HMa0LAV6fHiyIzBYHxThGUFe2+nk13XtpNH6w6G2j6fCfGWr+9jnX49m/dof3rl7X+XuSODF9GgGSBjyBgWC0wWl1zKG9Ko3VNTTMCxSI/5oD/8mVrtLG6g9zudIhPdiCGXjx0xKCwJVCC7Bh/jrHYKrKo6rOJJfHU1qymzv2wI8KHcQMzcCmlcUkBpPGWVFvtwNHqowkk84r1u6Jm2wElikezKAusHN2o9x4QU4494YACSmbM/zRssnexeJ3KCtGPUjHik0xk2G/N1/a8lOKAeV7pxbDO/pZsst3WMjTCZ94JPUZkSIa643cti8leiCRiIHmyru3lxaz33hGt34mJCY9uDCiWrDJ0XUlMNCymalT99Yj/gxf3no8oSmkt+1swNWs/Vsl331yOqRWmZkNjDCTxIOgwNTNjasZm7TdX1Zcly6V1IC7Uu21NKevtrgKvq0jkw5icKs+tlJ2Li6Z85agIRq0GOKKKSAYTJqeOtTVvfjb85DTZmpKez6peWUVHBEzPAxM4dw8eJMV3/MWmgH+UoMUfhc/gWHqeNx6ZXdUazituspRVNKDggGsYU08GG6wedDrt+uYam886roYN++dwPTdB9jjxHxS9QNnHgW7iNLivMbbxR2s3mOZ/BKzq/aswl9wfzOb/q8ETML/Kp0oAAAAASUVORK5CYII='
          }
          alt="Demagog.cz"
        />
      </a>
      <img
        src={
          // tslint:disable-next-line:max-line-length
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTEwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDExMCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTUuMiAoNzgxODEpIC0gaHR0cHM6Ly9za2V0Y2hhcHAuY29tIC0tPgogICAgPHRpdGxlPkdyb3VwIDM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRGVza3RvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYzLjAwMDAwMCwgLTEzLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjMuMDAwMDAwLCAxMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iRmlsbC0xIiBmaWxsPSIjMzQ1QzlBIiBwb2ludHM9IjUuNTc5NzEwMTQgNi40ODY0NjE4MyA3LjYyNDA2NTI2IDUuODQ1NDEwNjMgOS4wMDU4NTIyNyAxMC4wOTkyMjAyIDE4LjIwNDYyOTMgNy4yMjY1Njk5NCAxOC44NjQ3MzQzIDkuMjQ2MzY0NDIgNy42NTExNTkxMiAxMi43NTM2MjMyIDUuNTc5NzEwMTQgNi40ODY0NjE4MyI+PC9wb2x5bGluZT4KICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iRmlsbC0yIiBmaWxsPSIjRDYyNzMxIiBwb2ludHM9IjEzLjcxNzk4MTMgMjYuODM1NzQ4OCAxMS42NTQwODg1IDI3LjEwNzg1MjYgMTIuMjUyNjgyMiAzMS42NTE4MjQzIDcuNzA1MzE0MDEgMzIuMjQ2MjQxNiA3Ljk3NTA0NTY4IDM0LjMxMDUwNTMgMTIuNTIzMjIzOSAzMy43MTc3MDc3IDEzLjExODU3NzUgMzguMjYwODY5NiAxNS4xODE2NjAzIDM3Ljk4ODc2NTggMTQuNTg1NDk2NiAzMy40NDU2MDM5IDE5LjEzMDQzNDggMzIuODQ5NTY3IDE4Ljg2MTUxMzEgMzAuNzg2OTIyOSAxNC4zMTU3NjUgMzEuMzgwNTMwMyAxMy43MTc5ODEzIDI2LjgzNTc0ODgiPjwvcG9seWxpbmU+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy4yNDE3OTcwOCwxOS4zOTYxMzUzIEM3LjUwMjYxODU3LDE5LjQxMDg5ODcgNy43Njk5ODEwMywxOS40NTEwODgxIDguMDQzODg0NDgsMTkuNTEwOTYyMSBDOC4zMTUzMzUwNSwxOS41NjgzNzU2IDguNTg4NDIwODcsMTkuNjUxMjE1IDguODYxNTA2NjksMTkuNzYxOTQwOSBDOS4xMzcwNDUzOCwxOS44NjY5MjU1IDkuNDA5MzEzNTgsMjAuMDA3OTk4NSA5LjY3NTA0MDgsMjAuMTgwMjM4OCBDOS45NDQ4NTYxMywyMC4zNTE2NTg5IDEwLjIwOTc2NTcsMjAuNTY2NTQ5MiAxMC40NzM4NTc3LDIwLjgyMDgwODcgQzEwLjg0MTc4NzcsMjEuMTc1OTUxOSAxMS4xMjg3NzMxLDIxLjU0NTAzODMgMTEuMzMwNzI1OCwyMS45MjcyNDc3IEMxMS41MzI2Nzg1LDIyLjMxMzU1ODEgMTEuNjQ4NzgwOCwyMi42OTc0MDggMTEuNjgwNjY4MSwyMy4wODIwNzggQzExLjcxNTAwODIsMjMuNDYzNDY3MyAxMS42NjE4NjI4LDIzLjgzOTExNTIgMTEuNTI2OTU1MSwyNC4yMDI0NjAzIEMxMS4zOTIwNDc0LDI0LjU3MDcyNjUgMTEuMTczNzQyMywyNC45MTExMDYxIDEwLjg3Mjg1NzMsMjUuMjI0NDE5NSBDMTAuNTg1MDU0MywyNS41MjQ2MDk3IDEwLjI5NTYxNjEsMjUuNzQ1MjQxNCAxMC4wMDM3MjQ5LDI1Ljg4MjIxMzQgQzkuNzEzNDY5MDQsMjYuMDIzMjg2NSA5LjQyODExODg5LDI2LjEwOTQwNjYgOS4xNDYwMzkyMiwyNi4xNTA0MTYyIEM4Ljg2NzIzMDA1LDI2LjE5MDYwNTYgOC41OTQ5NjE4NSwyNi4xOTc5ODc0IDguMzMwMDUyMjUsMjYuMTcwMTAwOCBDOC4wNjU5NjAyOCwyNi4xNDMwMzQ1IDcuODE3NDAzMTIsMjYuMTEzNTA3NiA3LjU4NjgzMzY2LDI2LjA4MjM0MDMgQzcuMzU1NDQ2NTcsMjYuMDUyODEzNCA3LjE0MjA0NzE3LDI2LjA0MTMzMDcgNi45NDgyNzA3MSwyNi4wMzk2OTAzIEM2Ljc1NDQ5NDI0LDI2LjA0NDYxMTUgNi41ODQ0Mjg4MiwyNi4wOTM4MjMgNi40NDEzNDQ5NCwyNi4xODgxNDUgTDUuNDgyMjc0MDgsMjYuODUzMzIwNyBMNC4yMzYyMTc4MiwyNS42NTI1NTk3IEw1LjAxNzA0NzA0LDI0LjU3NDgyNzQgQzUuMTY5OTQyMzksMjQuMzU1MDE2IDUuMzUyMjcyMTQsMjQuMjA0MTAwNiA1LjU1OTk0ODE5LDI0LjEyNzgyMjggQzUuNzY2ODA2NjEsMjQuMDUwNzI0NyA1Ljk4ODM4MjIzLDI0LjAxNzkxNzEgNi4yMjM4NTc0MywyNC4wMTg3MzczIEM2LjQ1OTMzMjYyLDI0LjAyMjAxOCA2LjcwMjE2NjQyLDI0LjA0NTgwMzYgNi45NTQ4MTE2OSwyNC4wOTAwOTQgQzcuMjA5OTA5ODIsMjQuMTMzNTY0MSA3LjQ1OTI4NDU5LDI0LjE1ODk5MDEgNy43MDc4NDE3NSwyNC4xNjgwMTIyIEM3Ljk1NjM5ODksMjQuMTc2MjE0MSA4LjE5NzU5NzQ1LDI0LjE0OTk2OCA4LjQzMDYxOTc4LDI0LjA5MjU1NDUgQzguNjY1Mjc3MzYsMjQuMDMyNjgwNSA4Ljg3ODY3Njc2LDIzLjkwMzkxMDQgOS4wNzQ5MDYwOSwyMy42OTcyMjIgQzkuMzAxMzg3NDQsMjMuNDYxODI2OSA5LjQwNDQwNzg0LDIzLjE5NjkwNDkgOS4zODIzMzIwNCwyMi45MTA2NTc5IEM5LjM2MjcwOTExLDIyLjYyMTEzMDEgOS4yMTYzNTQ3MywyMi4zNDM5MDUyIDguOTQ0OTA0MTYsMjIuMDgxNDQzOCBDOC43MzcyMjgxMSwyMS44ODIxMzcyIDguNTQzNDUxNjUsMjEuNzM2OTYzMiA4LjM2Mjc1NzE0LDIxLjY0NTkyMTkgQzguMTgyMDYyNjMsMjEuNTU2NTIwOSA4LjAxNTI2NzcsMjEuNDg2ODA0NiA3Ljg2NDgyNTIxLDIxLjQ0NTc5NSBDNy43MTQzODI3MiwyMS40MDE1MDQ3IDcuNTgwMjkyNjgsMjEuMzY2MjM2NCA3LjQ2NDE5MDMzLDIxLjMzNzUyOTcgQzcuMzQ5NzIzMjIsMjEuMzA4MDAyOCA3LjI1MzI0Mzc5LDIxLjI1NjMzMDcgNy4xNzgwMjI1NSwyMS4xODY2MTQ0IEM3LjAxMTIyNzYyLDIxLjAyMDkzNTYgNi45NTY0NDY5MywyMC44MzA2NTEgNy4wMTIwNDUyNCwyMC42MDUwOTgyIEw3LjI0MTc5NzA4LDE5LjM5NjEzNTMgWiBNMS43MjI4NDcxMywyNy4zMjgyMTE5IEMxLjg1ODU3MjQyLDI3LjE4NjMxODcgMi4wMTA2NTAxNSwyNy4wODA1MTM5IDIuMTc5ODk3OTUsMjcuMDA5OTc3NCBDMi4zNDkxNDU3NSwyNi45Mzg2MjA3IDIuNTI2NTY5NzcsMjYuOTA0MTcyNiAyLjcwMzk5Mzc5LDI2LjkwMTcxMjEgQzIuODgzMDUzMDYsMjYuODk5MjUxNSAzLjA2MDQ3NzA4LDI2LjkzMjA1OTIgMy4yMzYyNjU4NSwyNy4wMDA5NTUzIEMzLjQxMjg3MjI1LDI3LjA2OTAzMTIgMy41NzQ3NjE0NSwyNy4xNzIzNzU0IDMuNzI0Mzg2MzEsMjcuMzE3NTQ5NCBDMy44Njk5MjMwNywyNy40NTk0NDI2IDMuOTgwMzAyMDcsMjcuNjE1Mjc5MSA0LjA1Mzg4ODA3LDI3Ljc4ODMzOTYgQzQuMTI5OTI2OTMsMjcuOTYzMDQwNSA0LjE3MDgwODA0LDI4LjE0MTg0MjMgNC4xNzY1MzE0LDI4LjMyNDc0NTIgQzQuMTg1NTI1MjQsMjguNTAzNTQ3IDQuMTU2MDkwODQsMjguNjgwNzA4NSA0LjA5MzEzMzkzLDI4Ljg1NTQwOTQgQzQuMDI4NTQxNzgsMjkuMDI3NjQ5NyAzLjkzMDQyNzExLDI5LjE4NDMwNjMgMy43OTM4ODQyLDI5LjMyNjE5OTYgQzMuNjU4OTc2NTQsMjkuNDY3MjcyNiAzLjUwMjgxMDY5LDI5LjU3Mzg5NzUgMy4zMzExMTAwMywyOS42NDY4OTQ2IEMzLjE2MDIyNjk5LDI5LjcyMjM1MjMgMi45ODQ0MzgyMSwyOS43NTkyNjA5IDIuODAyMTA4NDYsMjkuNzU4NDU0MSBDMi42MjIyMzE1NywyOS43NTU5ODAyIDIuNDQ0ODA3NTUsMjkuNzIyMzUyMyAyLjI3MDY1NDAyLDI5LjY1MzQ1NjIgQzIuMDk0ODY1MjQsMjkuNTc5NjM4OSAxLjkzNjI0NjUzLDI5LjQ3NzExNDkgMS43OTA3MDk3OCwyOS4zMzUyMjE3IEMxLjY0MTkwMjUzLDI5LjE5MDg2NzkgMS41Mjk4ODgyOSwyOS4wMzU4NTE2IDEuNDUwNTc4OTMsMjguODY0NDMxNSBDMS4zNzQ1NDAwNywyOC42OTA1NTA4IDEuMzM1Mjk0MiwyOC41MTQyMDk1IDEuMzI4NzUzMjIsMjguMzM3MDQ4IEMxLjMyNTQ4Mjc0LDI4LjE1NzQyNiAxLjM1NDA5OTUxLDI3Ljk3NzgwMzkgMS40MjAzMjY5MSwyNy44MDE0NjI3IEMxLjQ4NTczNjY5LDI3LjYyODQwMjIgMS41ODU0ODY2LDI3LjQ3MDEwNTEgMS43MjI4NDcxMywyNy4zMjgyMTE5IEwxLjcyMjg0NzEzLDI3LjMyODIxMTkgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iI0YxQjIzNyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU3LjQzNzkzMzQsMTEuMDY5OTAzIEM1Ny4yOTM2Nzc5LDExLjE4NDMzOTggNTcuMTkxNTY0NSwxMS4zMTc3MTIxIDU3LjEzNDgzNDgsMTEuNDY1MDgwMyBMNTUuMDkxNzU1OCwxNy4yNDcwMTc2IEM1NC45OTM2OTQ1LDE3LjQ5NzI5NjUgNTQuOTAxMzA2MiwxNy43NzcyMTM3IDU0LjgxNzAyMjEsMTguMDc2ODg5OCBDNTQuNzQ4MTM2LDE4LjMxNDgxOTQgNTQuNjg0OTIzLDE4LjU2NzU2ODIgNTQuNjI2NTcyNCwxOC44Mjg1NDk5IEM1NC41NTc2ODY0LDE4LjU2Njc0NDkgNTQuNDg1NTU4NiwxOC4zMTM5OTYyIDU0LjQxMTgxMDEsMTguMDc1MjQzMiBDNTQuMzE4NjExMywxNy43NzM5MjA2IDU0LjIyMjE3MDgsMTcuNDk0ODI2NiA1NC4xMjY1NDA4LDE3LjI0ODY2NDEgTDUyLjA2NzI1MzMsMTEuNDYyNjEwNCBDNTEuOTk2NzQ2NCwxMS4yOTcxMjk5IDUxLjg5MTM5MTMsMTEuMTU5NjQxMiA1MS43NTM2MTkyLDExLjA1NDI2MDYgQzUxLjYxNTg0NzIsMTAuOTQ3MjMzNCA1MS40MzE4ODA5LDEwLjg5MzcxOTggNTEuMjA4MjAzOSwxMC44OTM3MTk4IEw0OS4xNTQ1ODk0LDEwLjg5MzcxOTggTDUzLjQ0MTczMjUsMjEuNzU4NjI0NiBMNTMuNDUzODg4OCwyMS43ODc0Mzk2IEw1NS43NDkwMDk3LDIxLjc4NzQzOTYgTDYwLjAyMzE4NiwxMC45NTcxMTI4IEw2MC4wNDgzMDkyLDEwLjg5MzcxOTggTDU3Ljk4MDkxNzUsMTAuODkzNzE5OCBDNTcuNzY2MTU1MSwxMC44OTM3MTk4IDU3LjU4Mjk5OTMsMTAuOTUyOTk2NCA1Ny40Mzc5MzM0LDExLjA2OTkwMyIgaWQ9IkZpbGwtNCIgZmlsbD0iIzMxMkI0NyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJGaWxsLTUiIGZpbGw9IiMzMTJCNDciIHBvaW50cz0iNjMuNzI1ODc1NSAxMC44OTM3MTk4IDYxLjExMTExMTEgMTAuODkzNzE5OCA2MS4xMTExMTExIDIxLjc4NzQzOTYgNjcuNzUzNjIzMiAyMS43ODc0Mzk2IDY3Ljc1MzYyMzIgMTkuNjkzMDAwMSA2My43MjU4NzU1IDE5LjY5MzAwMDEgNjMuNzI1ODc1NSAxMC44OTM3MTk4Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTc0LjMzMTk5MzgsMTQuMDE2NDQzNCBDNzQuMzk4NDY4NCwxMy44MDg5NzU0IDc0LjQ2MzMyMTYsMTMuNTgyNTcxNyA3NC41MjQxMjE1LDEzLjM0Mjk5NTUgQzc0LjU5MTQwNjcsMTMuNTc1MTYyMiA3NC42NTc4ODEzLDEzLjc5NjYyNjEgNzQuNzI1OTc3MiwxNC4wMDQ5MTc0IEM3NC44MDg2NjUsMTQuMjYwMTM2MSA3NC44ODcyOTk2LDE0LjQ4MzI0NjYgNzQuOTU5NDQ4OCwxNC42Njg0ODU5IEw3NS45MjQxNDA0LDE3LjU2NDgwNTkgTDczLjE0MTEyNjYsMTcuNTY0ODA1OSBMNzQuMDk2OTAwOSwxNC42ODU3NzQ5IEM3NC4xNjkwNTAxLDE0LjUwMTM1ODkgNzQuMjQ2ODc0LDE0LjI3NDk1NTIgNzQuMzMxOTkzOCwxNC4wMTY0NDM0IFogTTc3LjEzNjg5NTcsMjEuMjE4NTQ5IEM3Ny4yMDY2MTI5LDIxLjM4NDAyOTUgNzcuMzEzNjIwNywyMS41MjE1MTgyIDc3LjQ0OTgxMjUsMjEuNjI2ODk4OSBDNzcuNTg4NDM2MiwyMS43MzM5MjYgNzcuNzcyNDU3MiwyMS43ODc0Mzk2IDc3Ljk5NzAxMTUsMjEuNzg3NDM5NiBMNzkuOTc1ODQ1NCwyMS43ODc0Mzk2IEw3NS44MzQxNTY2LDEwLjkyMzM1ODEgTDc1LjgyMzYxNzksMTAuODkzNzE5OCBMNzMuMjM0MzUzMSwxMC44OTM3MTk4IEw2OS4xMDU2MzQ5LDIxLjcyNDg2OTkgTDY5LjA4MjEyNTYsMjEuNzg3NDM5NiBMNzEuMDc1NTUxNSwyMS43ODc0Mzk2IEM3MS4yODk1NjcxLDIxLjc4NzQzOTYgNzEuNDcyNzc3NSwyMS43Mjg5ODYzIDcxLjYxODY5NzIsMjEuNjEwNDMzMSBDNzEuNzYyMTg1LDIxLjQ5NTk5NjQgNzEuODY1MTM5NSwyMS4zNjM0NDczIDcxLjkyMjY5NjcsMjEuMjE1MjU1OSBMNzIuNTM5NjEzLDE5LjM2MzY4NTggTDc2LjUxODM1ODEsMTkuMzYzNjg1OCBMNzcuMTM2ODk1NywyMS4yMTg1NDkgTDc3LjEzNjg5NTcsMjEuMjE4NTQ5IFoiIGlkPSJGaWxsLTYiIGZpbGw9IiMzMTJCNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03NS4wNjYxNzk2LDEwLjM1NTA0OCBDNzUuMTM1NDM2MSwxMC4zNTAyMDA3IDc1LjIwMTM5NDgsMTAuMzM4ODkwNSA3NS4yNjMyMzEsMTAuMzI1MTU2NyBDNzUuMzI2NzE2MiwxMC4zMDk4MDcxIDc1LjM4NzcyNzksMTAuMjg1NTcwOSA3NS40NDQ2MTcyLDEwLjI1NDg3MTcgQzc1LjUwMjMzMSwxMC4yMjQxNzI1IDc1LjU2NDE2NzMsMTAuMTgwNTQ3NCA3NS42MjQzNTQ1LDEwLjEyMzk5NjMgTDc4LjAyMjc3NTUsOC4wNTA5OTM5MyBMNzguMTE1OTQyLDcuOTcxMDE0NDkgTDc1LjQ1MjAzNzYsNy45NzEwMTQ0OSBDNzUuMzQ0MDMwMyw3Ljk3MTAxNDQ5IDc1LjI0MTc5NDQsNy45NzQyNDU5OSA3NS4xNDg2Mjc4LDcuOTc4Mjg1MzUgQzc1LjA1ODc1OTIsNy45ODM5NDA0NiA3NC45NzcxMzU0LDcuOTk4NDgyMTggNzQuOTA3MDU0Myw4LjAyMDI5NDc1IEM3NC44MzM2NzU0LDguMDQzNzIzMDcgNzQuNzY2MDY3OCw4LjA4MTY5MzExIDc0LjcwNTg4MDUsOC4xMzA5NzMzNiBDNzQuNjQ1NjkzMiw4LjE3OTQ0NTc1IDc0LjU4NDY4MTUsOC4yNDQwNzU2IDc0LjUyMjg0NTMsOC4zMjY0Nzg2NSBMNzMuMTE4NzUwOCwxMC4yOTEyMjYgTDczLjA2NzYzMjksMTAuMzYyMzE4OCBMNzQuODM1MzI0MywxMC4zNjIzMTg4IEM3NC45MTYxMjM3LDEwLjM2MjMxODggNzQuOTkzNjI1MSwxMC4zNTkwODczIDc1LjA2NjE3OTYsMTAuMzU1MDQ4IiBpZD0iRmlsbC03IiBmaWxsPSIjMzEyQjQ3Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNODYuNzc2MDU3NywxOS41MjkxNjYyIEM4Ni40MTA0MDQ1LDE5LjY4NjQxMzggODUuOTg3NDkwMiwxOS43NjcwOTU5IDg1LjUyMDQwMywxOS43NjcwOTU5IEw4My45MDE1NDksMTkuNzY3MDk1OSBMODMuOTAxNTQ5LDEyLjkxMzI0MDMgTDg1LjUyMDQwMywxMi45MTMyNDAzIEM4NS45ODc0OTAyLDEyLjkxMzI0MDMgODYuNDEwNDA0NSwxMi45OTM5MjIzIDg2Ljc3NjA1NzcsMTMuMTUxMTY5OSBDODcuMTQwODkyOSwxMy4zMDc1OTQyIDg3LjQ1NDE5MzEsMTMuNTM2NDY3NyA4Ny43MDY5NjAxLDEzLjgyODczNDIgQzg3Ljk1ODA5MSwxNC4xMjAxNzc1IDg4LjE1NTIzMjksMTQuNDgyNDIzMyA4OC4yODkzODc2LDE0LjkwNTU5MjMgQzg4LjQyNTk5NjMsMTUuMzI4NzYxMyA4OC40OTQ3MDk2LDE1LjgxMDM4MzYgODguNDk0NzA5NiwxNi4zMzY0NjMzIEM4OC40OTQ3MDk2LDE2Ljg2NzQ4MjcgODguNDI1OTk2MywxNy4zNTE1NzQ5IDg4LjI4OTM4NzYsMTcuNzc1NTY3MSBDODguMTU1MjMyOSwxOC4xOTc5MTI4IDg3Ljk1ODA5MSwxOC41NjAxNTg3IDg3LjcwNjk2MDEsMTguODUyNDI1MiBDODcuNDUzMzc1MSwxOS4xNDU1MTUgODcuMTQwMDc0OSwxOS4zNzM1NjUyIDg2Ljc3NjA1NzcsMTkuNTI5MTY2MiBaIE04Ny44MTczOTIzLDIxLjM4MTU1OTYgQzg4LjUwNTM0MzgsMjEuMTA5ODc1MyA4OS4xMDA4NTk2LDIwLjcyNzA0NzMgODkuNTg5MjE1MiwyMC4yNDI5NTUyIEM5MC4wNzc1NzA4LDE5Ljc2MDUwOTYgOTAuNDYxMjIwNCwxOS4xNzg0NDY0IDkwLjczMTE2NTcsMTguNTE1NzAxMiBDOTAuOTk5NDc1LDE3Ljg1MjEzMjcgOTEuMTM1MjY1NywxNy4xMTk0MDgyIDkxLjEzNTI2NTcsMTYuMzM2NDYzMyBDOTEuMTM1MjY1NywxNS41NTg0NTggOTAuOTk5NDc1LDE0LjgyODIwMzQgOTAuNzMxMTY1NywxNC4xNjU0NTgyIEM5MC40NjEyMjA0LDEzLjUwMjcxMyA5MC4wNzc1NzA4LDEyLjkyMTQ3MzEgODkuNTg5MjE1MiwxMi40Mzk4NTA4IEM4OS4wOTkyMjM1LDExLjk1NzQwNTMgODguNTAyODg5OCwxMS41NzYyMjM5IDg3LjgxNzM5MjMsMTEuMzAzNzE2MiBDODcuMTMxMDc2NywxMS4wMzEyMDg2IDg2LjM1ODA1MTUsMTAuODkzNzE5OCA4NS41MjA0MDMsMTAuODkzNzE5OCBMODEuMzA0MzQ3OCwxMC44OTM3MTk4IEw4MS4zMDQzNDc4LDIxLjc4NzQzOTYgTDg1LjUyMDQwMywyMS43ODc0Mzk2IEM4Ni4zNTgwNTE1LDIxLjc4NzQzOTYgODcuMTMwMjU4NywyMS42NTA3NzQxIDg3LjgxNzM5MjMsMjEuMzgxNTU5NiBMODcuODE3MzkyMywyMS4zODE1NTk2IFoiIGlkPSJGaWxsLTgiIGZpbGw9IiMzMTJCNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMDAuMjQ3NjM1LDE2LjY1NTA3NDkgQzEwMC4yNDc2MzUsMTYuODI3OTY1IDEwMC4yNTI1OTYsMTcuMDE0ODUwOSAxMDAuMjYyNTE4LDE3LjIxMDc5MyBDMTAwLjI2OTk2LDE3LjM1NDA0NDcgMTAwLjI4MDcwOSwxNy41MDMwNTk1IDEwMC4yOTY0MiwxNy42NTYxOTA3IEw5NS4yMzc2MzcxLDExLjI5NDY2MDEgQzk1LjE2NDg3MjYsMTEuMjA5MDM4MyA5NS4xMDI4NTc1LDExLjE0MjM1MjIgOTUuMDQ3NDU3MywxMS4wODk2NjE5IEM5NC45ODc5MjI3LDExLjAzNjk3MTYgOTQuOTI1OTA3NiwxMC45OTU4MDczIDk0Ljg2Mzg5MjQsMTAuOTY4NjM4OCBDOTQuODAxMDUwNCwxMC45MzgxNzcyIDk0LjcyODI4NTksMTAuOTE4NDE4NCA5NC42NDg5MDY1LDEwLjkwNzcxNTcgQzk0LjU3NDQ4ODMsMTAuODk3ODM2MiA5NC40ODE4NzksMTAuODkzNzE5OCA5NC4zNjY5NDQzLDEwLjg5MzcxOTggTDkyLjk5NTE2OTEsMTAuODkzNzE5OCBMOTIuOTk1MTY5MSwyMS43ODc0Mzk2IEw5NS4zMDc5MjA5LDIxLjc4NzQzOTYgTDk1LjMwNzkyMDksMTUuOTUwMzQyMiBDOTUuMzA3OTIwOSwxNS43OTM5MTc4IDk1LjMwMzc4NjYsMTUuNjIxODUxMSA5NS4yOTYzNDQ3LDE1LjQ0MDcyODIgQzk1LjI5MTM4MzUsMTUuMzEwNjQ5IDk1LjI4MjI4OCwxNS4xNzU2MzAxIDk1LjI2OTg4NDksMTUuMDM3MzE4IEwxMDAuMjg4MTUxLDIxLjM1Njg2MTEgQzEwMC40MjIxMDQsMjEuNTEzMjg1NCAxMDAuNTU3NzEsMjEuNjI2ODk4OSAxMDAuNjk1Nzk4LDIxLjY5MTExNTIgQzEwMC44MzMwNTgsMjEuNzU2MTU0NyAxMDEuMDA0MjIsMjEuNzg3NDM5NiAxMDEuMjAyNjY4LDIxLjc4NzQzOTYgTDEwMi41NjAzODYsMjEuNzg3NDM5NiBMMTAyLjU2MDM4NiwxMC44OTM3MTk4IEwxMDAuMjQ3NjM1LDEwLjg5MzcxOTggTDEwMC4yNDc2MzUsMTYuNjU1MDc0OSIgaWQ9IkZpbGwtOSIgZmlsbD0iIzMxMkI0NyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkZpbGwtMTAiIGZpbGw9IiMzMTJCNDciIHBvaW50cz0iMTA1LjIxNzM5MSAyMS43ODc0Mzk2IDEwNy44NzQzOTYgMjEuNzg3NDM5NiAxMDcuODc0Mzk2IDEwLjg5MzcxOTggMTA1LjIxNzM5MSAxMC44OTM3MTk4Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTA3LjMzNjA5Niw3Ljk3MTAxNDQ5IEMxMDcuMjI4MDg4LDcuOTcxMDE0NDkgMTA3LjEyNTg1Miw3Ljk3NDI0NTk5IDEwNy4wMzI2ODYsNy45NzgyODUzNSBDMTA2Ljk0MjgxNyw3Ljk4Mzk0MDQ2IDEwNi44NjAzNjksNy45OTg0ODIxOCAxMDYuNzkxMTEyLDguMDIwMjk0NzUgQzEwNi43MTc3MzMsOC4wNDM3MjMwNyAxMDYuNjUwMTI2LDguMDgxNjkzMTEgMTA2LjU4OTkzOCw4LjEzMDk3MzM2IEMxMDYuNTMwNTc2LDguMTc5NDQ1NzUgMTA2LjQ2ODczOSw4LjI0NDA3NTYgMTA2LjQwNjkwMyw4LjMyNjQ3ODY1IEwxMDUuMDAyODA5LDEwLjI5MTIyNiBMMTA0Ljk1MTY5MSwxMC4zNjIzMTg4IEwxMDYuNzE5MzgyLDEwLjM2MjMxODggQzEwNi44MDAxODIsMTAuMzYyMzE4OCAxMDYuODc3NjgzLDEwLjM1OTA4NzMgMTA2Ljk1MDIzOCwxMC4zNTUwNDggQzEwNy4wMTk0OTQsMTAuMzUwMjAwNyAxMDcuMDg1NDUzLDEwLjMzODg5MDUgMTA3LjE0NzI4OSwxMC4zMjUxNTY3IEMxMDcuMjEwNzc0LDEwLjMwOTgwNzEgMTA3LjI3MTc4NiwxMC4yODU1NzA5IDEwNy4zMjg2NzUsMTAuMjU0ODcxNyBDMTA3LjM4NjM4OSwxMC4yMjQxNzI1IDEwNy40NDgyMjUsMTAuMTgwNTQ3NCAxMDcuNTA4NDEyLDEwLjEyMzk5NjMgTDEwOS45MDY4MzMsOC4wNTA5OTM5MyBMMTEwLDcuOTcxMDE0NDkgTDEwNy4zMzYwOTYsNy45NzEwMTQ0OSIgaWQ9IkZpbGwtMTEiIGZpbGw9IiMzMTJCNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik01Ny40MjA1MTY2LDMwLjIzMDQzNSBDNTcuMTkzNDUyNiwzMC4wMDU5NTkyIDU2LjkyOTIzMjYsMjkuODE2OTcwMyA1Ni42MzUyODgsMjkuNjcxNzIxMiBDNTYuMzQ2Mjk3NCwyOS41Mjg5NDggNTYuMDQ1NzQ3MiwyOS40MDE4NTUxIDU1Ljc0MTA2ODYsMjkuMjk1Mzk0MSBDNTUuNDUyMDc4LDI5LjE5MzA1OTUgNTUuMTUyMzUzNSwyOS4wOTQwMjYxIDU0Ljg1MDE1MiwyOS4wMDMyNDU0IEM1NC41NjUyODk5LDI4LjkxODI0MTcgNTQuMzA2ODQ5NywyOC44MjE2ODQgNTQuMDgzOTE0MiwyOC43MjAxNzQ3IEM1My44NjM0NTU2LDI4LjYxNzg0MDIgNTMuNjg0MjgxNSwyOC40OTY1MjQyIDUzLjU1MTM0NTgsMjguMzU3ODc3MyBDNTMuNDIwMDYxNiwyOC4yMjI1MzE2IDUzLjM1NTY1OCwyOC4wNTU4MjUzIDUzLjM1NTY1OCwyNy44NDc4NTUgQzUzLjM1NTY1OCwyNy41MjE4Njk5IDUzLjQ2NzEyNTcsMjcuMjYxMDgxOCA1My42ODU5MzI5LDI3LjA3MDQ0MjQgQzUzLjkwNjM5MTQsMjYuODc4MTUyNCA1NC4yNDk4NzczLDI2Ljc3OTk0NDIgNTQuNzA3MzA4MSwyNi43Nzk5NDQyIEM1NC45NzE1MjgsMjYuNzc5OTQ0MiA1NS4yMTA5NzczLDI2LjgxNjI1NjUgNTUuNDIwNzAxOSwyNi44ODY0MDUyIEM1NS42MzEyNTIyLDI2Ljk1NjU1MzkgNTUuODE5NTA4OSwyNy4wMzY2MDU5IDU1Ljk4MjE2OTMsMjcuMTI0OTEwOCBDNTYuMTQ4MTMyNCwyNy4yMTMyMTU2IDU2LjI5Njc1NjIsMjcuMjk0MDkyOSA1Ni40MjgwNDA0LDI3LjM2NTg5MjIgQzU2LjcyMTE1OTQsMjcuNTI1MTcxIDU2Ljk5NTI4NzYsMjcuNTAyODg4NSA1Ny4xNjIwNzY1LDI3LjM4MDc0NzIgQzU3LjI0Nzk0NzksMjcuMzE5Njc2NiA1Ny4zMzA1MTY3LDI3LjIyNTU5NDggNTcuNDA5NzgyNywyNy4wOTg1MDE5IEw1OC4wMzQ4MjgsMjUuOTI5OTA3IEw1OC4wNTIxNjc0LDI1Ljg5NzcyMTIgTDU4LjAyNTc0NTQsMjUuODczNzg4MSBDNTcuODI4NDA2MSwyNS42OTMwNTIgNTcuNjAzODE5MiwyNS41Mjk2NDY4IDU3LjM1ODU5LDI1LjM4ODUyNDEgQzU3LjExMDg4MzksMjUuMjQ1NzUwOSA1Ni44NDE3MDk4LDI1LjEyMjc4NDMgNTYuNTU5MzI0NywyNS4wMjEyNzUgQzU2LjI3MzYzNjksMjQuOTE4OTQwNSA1NS45Njk3ODQsMjQuODQwNTM5IDU1LjY1NTE5NzEsMjQuNzg4NTQ2NCBDNTUuMzQxNDM1OSwyNC43MzY1NTM4IDU1LjAxMTk4NjcsMjQuNzEwMTQ0OSA1NC42NzY3NTc3LDI0LjcxMDE0NDkgQzU0LjA3ODEzNDQsMjQuNzEwMTQ0OSA1My41Mzk3ODYyLDI0LjgwMjU3NjIgNTMuMDc2NTc1NiwyNC45ODQxMzc1IEM1Mi42MTI1Mzk0LDI1LjE2NTY5ODggNTIuMjE0NTU4MSwyNS40MTMyODI1IDUxLjg5MzM2NTcsMjUuNzE4NjM1NyBDNTEuNTczODI0NywyNi4wMjQ4MTQxIDUxLjMyNjk0NDIsMjYuMzc3MjA4MiA1MS4xNjE4MDY4LDI2Ljc2NzU2NSBDNTAuOTk2NjY5MywyNy4xNTg3NDcyIDUwLjkxMjQ0OTIsMjcuNTYzOTU5MSA1MC45MTI0NDkyLDI3Ljk3NDEyMjcgQzUwLjkxMjQ0OTIsMjguNDgzMzE5NyA1MC45ODM0NTgzLDI4LjkxODI0MTcgNTEuMTI0NjUwOCwyOS4yNjY1MDkzIEM1MS4yNjU4NDM0LDI5LjYxNjQyNzYgNTEuNDUyNDQ4NywyOS45MTE4Nzc0IDUxLjY4MTE2NDEsMzAuMTQzNzgwNyBDNTEuOTA4MjI4MSwzMC4zNzczMzQ2IDUyLjE3MjQ0OCwzMC41Njc5NzQgNTIuNDYzMDksMzAuNzExNTcyNiBDNTIuNzUxMjU0OCwzMC44NTE4NyA1My4wNTA5NzkzLDMwLjk3MzE4NTkgNTMuMzU0ODMyMywzMS4wNzA1Njg4IEM1My42NTUzODI0LDMxLjE2NTQ3NTkgNTMuOTUzNDU1NiwzMS4yNTU0MzEzIDU0LjI0MTYyMDQsMzEuMzMzODMyOCBDNTQuNTI0MDA1NSwzMS40MTIyMzQzIDU0Ljc3OTk2ODYsMzEuNTAzODQwMiA1NS4wMDM3Mjk4LDMxLjYwNjE3NDggQzU1LjIyMjUzNywzMS43MDg1MDk0IDU1LjQwMDg4NTQsMzEuODM3MjUyOSA1NS41MzM4MjExLDMxLjk4OTEwNDIgQzU1LjY2NDI3OTcsMzIuMTM3NjU0NCA1NS43MzExNjA0LDMyLjMzNDg5NiA1NS43MzExNjA0LDMyLjU3NTA1MjEgQzU1LjczMTE2MDQsMzIuOTkzNDY4NSA1NS42MDg5NTg2LDMzLjMwMjEyMjggNTUuMzY5NTA5MywzMy40OTM1ODc1IEM1NS4xMjU5MzE2LDMzLjY4NjcwMjcgNTQuNzc4MzE3MiwzMy43ODQwODU2IDU0LjMzNTc0ODgsMzMuNzg0MDg1NiBDNTQuMDA0NjQ4MiwzMy43ODQwODU2IDUzLjcxNDgzMTksMzMuNzM3MDQ0NyA1My40NzQ1NTY5LDMzLjY0NjI2NDEgQzUzLjIyODUwMjEsMzMuNTUzMDA3NiA1My4wMDk2OTUsMzMuNDQ5MDIyNCA1Mi44MjM5MTUzLDMzLjMzNzYwOTggQzUyLjYzMzE4MTYsMzMuMjIzNzIxMyA1Mi40NjIyNjQzLDMzLjExOTczNjIgNTIuMzExMTYzNSwzMy4wMjU2NTQ0IEM1Mi4wMzIwODEyLDMyLjg0OTg3IDUxLjczMzE4MjQsMzIuODI4NDEyNyA1MS40OTcwMzU4LDMyLjk2OTUzNTQgQzUxLjM5NDY1MDYsMzMuMDMwNjA2MSA1MS4zMTEyNTYyLDMzLjEwNjUzMTcgNTEuMjQ2ODUyNiwzMy4xOTczMTI0IEw1MC40ODMwOTE4LDM0LjQwMjIxOTUgTDUwLjUxMDMzOTUsMzQuNDI4NjI4NCBDNTAuNzI1MDE4MiwzNC42NDQwMjYyIDUwLjk4MTgwNjksMzQuODQwNDQyNSA1MS4yNjk5NzE4LDM1LjAxNTQwMTYgQzUxLjU1OTc4OCwzNS4xODk1MzU1IDUxLjg3MTg5NzgsMzUuMzQzMDM3MyA1Mi4xOTg4NywzNS40NjkzMDUgQzUyLjUyODMxOTMsMzUuNTk2Mzk3OSA1Mi44NzI2MzA5LDM1LjY5NTQzMTQgNTMuMjIxODk2NiwzNS43NjQ3NTQ4IEM1My41NzI4MTM3LDM1LjgzNDA3ODIgNTMuOTIyMDc5NCwzNS44Njk1NjUyIDU0LjI2MDYxMTIsMzUuODY5NTY1MiBDNTQuODc2NTc0LDM1Ljg2OTU2NTIgNTUuNDM2MzksMzUuNzc0NjU4MiA1NS45MjUxOTY5LDM1LjU4ODk3MDQgQzU2LjQxMDcwMSwzNS40MDE2MzIxIDU2LjgyNjg0NzQsMzUuMTQwMDE4NyA1Ny4xNjA0MjUxLDM0LjgxMTU1NzggQzU3LjQ5MzE3NzEsMzQuNDgzOTIyMSA1Ny43NTA3OTE1LDM0LjA5NDM5MDUgNTcuOTI1MDExNSwzMy42NTUzNDIxIEM1OC4xMDAwNTczLDMzLjIxNzExOTEgNTguMTg4NDA1OCwzMi43Mzc2MzIxIDU4LjE4ODQwNTgsMzIuMjMyNTYxNCBDNTguMTg4NDA1OCwzMS43Nzc4MzI4IDU4LjExNzM5NjcsMzEuMzgyNTI0MiA1Ny45NzcwMjk4LDMxLjA1ODE4OTcgQzU3LjgzNjY2MywzMC43MzU1MDU2IDU3LjY0OTIzMiwzMC40NTY1NjE0IDU3LjQyMDUxNjYsMzAuMjMwNDM1IiBpZD0iRmlsbC0xMiIgZmlsbD0iIzMxMkI0NyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJGaWxsLTEzIiBmaWxsPSIjMzEyQjQ3IiBwb2ludHM9IjYyLjkyOTEwMDIgMjQuNzEwMTQ0OSA2MC4zMTQwMDk3IDI0LjcxMDE0NDkgNjAuMzE0MDA5NyAzNS42MDM4NjQ3IDY2Ljk1NjUyMTcgMzUuNjAzODY0NyA2Ni45NTY1MjE3IDMzLjUwODc2MDMgNjIuOTI5MTAwMiAzMy41MDg3NjAzIDYyLjkyOTEwMDIgMjQuNzEwMTQ0OSI+PC9wb2x5bGluZT4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTE0IiBmaWxsPSIjMzEyQjQ3IiBwb2ludHM9IjY4LjU1MDcyNDYgMzUuNjAzODY0NyA3MS4yMDc3Mjk1IDM1LjYwMzg2NDcgNzEuMjA3NzI5NSAyNC43MTAxNDQ5IDY4LjU1MDcyNDYgMjQuNzEwMTQ0OSI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTc5LjY0Njk0NywyOC42MDY0NjI5IEM3OS41Njk5NjA4LDI4Ljc3MDI4NDQgNzkuNDU1NzIzMywyOC45MDExNzcgNzkuMzA3NTQ1NywyOC45OTQyMDEzIEM3OS4xNTY4ODQ3LDI5LjA4OTY5NTIgNzguOTcwNjI3OSwyOS4xNTcxOTk2IDc4Ljc1NDU3LDI5LjE5NTA2NzkgQzc4LjUzMTg4OTcsMjkuMjMzNzU5NCA3OC4yODE4OTE3LDI5LjI1MzUxNjggNzguMDA5NTQyOCwyOS4yNTM1MTY4IEw3Ni43NDQ2NTIzLDI5LjI1MzUxNjggTDc2Ljc0NDY1MjMsMjYuNjc4NDcyOSBMNzguMTczNDQ4OCwyNi42Nzg0NzI5IEM3OC40NTMyNDc5LDI2LjY3ODQ3MjkgNzguNjk2NjIzNCwyNi42OTk4NzY3IDc4Ljg5Nzc4MDgsMjYuNzQ0MzMwOCBDNzkuMDk2NDU0NywyNi43ODYzMTUyIDc5LjI2MTE4ODUsMjYuODU4NzU4OSA3OS4zODk0OTg3LDI2Ljk1NjcyMjUgQzc5LjUxNDQ5NzcsMjcuMDU1NTA5NCA3OS42MTA1MjM0LDI3LjE4NzIyNTIgNzkuNjcxNzgxMiwyNy4zNDg1NzcgQzc5LjczNDY5NDYsMjcuNTEyMzk4NiA3OS43NjY5NzkxLDI3LjcyMzE0MzggNzkuNzY2OTc5MSwyNy45NzI1ODA2IEM3OS43NjY5NzkxLDI4LjIyNjk1NjggNzkuNzI2NDE2NSwyOC40NDAxNzE3IDc5LjY0Njk0NywyOC42MDY0NjI5IFogTTc5Ljk4MzAzNywzMi43NTA1NzEyIEM3OS45NDE2NDY2LDMyLjkxMDI3NjYgNzkuODYyMTc3LDMzLjA1NTk4NzIgNzkuNzQ3OTM5NSwzMy4xODQ0MTAyIEM3OS42MzQ1Mjk4LDMzLjMxMTE4NjYgNzkuNDczOTM1MSwzMy40MTY1NTkyIDc5LjI3MTEyMjIsMzMuNDk2NDExOSBDNzkuMDY0OTk4LDMzLjU3OTU1NzUgNzguNzk2Nzg4MiwzMy42MjA3MTg3IDc4LjQ3MTQ1OTcsMzMuNjIwNzE4NyBMNzYuNzQ0NjUyMywzMy42MjA3MTg3IEw3Ni43NDQ2NTIzLDMxLjAyMTgwMTQgTDc4LjQ1NjU1OTEsMzEuMDIxODAxNCBDNzguNzY5NDcwNSwzMS4wMjE4MDE0IDc5LjAzMTA1NzgsMzEuMDUxNDM3NCA3OS4yMzM4NzA4LDMxLjEwOTA2MzEgQzc5LjQzNDIwMDMsMzEuMTY2Njg4OCA3OS41OTgxMDYzLDMxLjI0ODE4NzkgNzkuNzE4OTY2MywzMS4zNTE5MTQxIEM3OS44MzgxNzA2LDMxLjQ1NDgxNzEgNzkuOTI1MDkwNCwzMS41ODI0MTY3IDc5Ljk3NDc1ODksMzEuNzMxNDIwMiBDODAuMDIzNTk5NiwzMS44ODQ1Mzk5IDgwLjA1MDA4OTQsMzIuMDU5ODg2NSA4MC4wNTAwODk0LDMyLjI1MDg3NDQgQzgwLjA1MDA4OTQsMzIuNDE3OTg4OCA4MC4wMjc3Mzg2LDMyLjU4Njc0OTcgNzkuOTgzMDM3LDMyLjc1MDU3MTIgWiBNODAuNjM4NjYwOSwyOS45NTgxOTYzIEM4MC45MTEwMDk3LDI5Ljg1MDM1NCA4MS4xNTEwNzQsMjkuNzIzNTc3NSA4MS4zNTM4ODcsMjkuNTgzNjI5NSBDODEuNTkwNjQsMjkuNDE3MzM4MyA4MS43ODc2NTgzLDI5LjIzMjkzNjIgODEuOTM4MzE5NCwyOS4wMzUzNjI1IEM4Mi4wODg5ODA0LDI4LjgzNjk2NTYgODIuMjAzMjE3OSwyOC42MjA0NTc3IDgyLjI3MzU4MTYsMjguMzkxNjAxNSBDODIuMzQzOTQ1MywyOC4xNjI3NDUzIDgyLjM3ODcxMzIsMjcuOTIzMTg3MiA4Mi4zNzg3MTMyLDI3LjY3NzA0MzMgQzgyLjM3ODcxMzIsMjcuMjI3NTYzMSA4Mi4zMDE3MjcxLDI2LjgxNTEyOCA4Mi4xNDk0MTA0LDI2LjQ1MDQzOTkgQzgxLjk5NTQzODEsMjYuMDg0MTA1NCA4MS43NDU0NDAxLDI1Ljc2ODgxMDcgODEuNDA3Njk0NSwyNS41MTE5NjQ5IEM4MS4wNjkxMjEsMjUuMjU3NTg4NyA4MC42MzAzODI4LDI1LjA1NjcyMjEgODAuMTAwNTg1NywyNC45MTg0MjA1IEM3OS41NzU3NTU1LDI0Ljc4MDExODkgNzguOTI2NzU0LDI0LjcxMDE0NDkgNzguMTczNDQ4OCwyNC43MTAxNDQ5IEw3NC4xMzA0MzQ4LDI0LjcxMDE0NDkgTDc0LjEzMDQzNDgsMzUuNjAzODY0NyBMNzguNTE1MzMzNSwzNS42MDM4NjQ3IEM3OS4xNjc2NDYyLDM1LjYwMzg2NDcgNzkuNzU3MDQ1NCwzNS41MTkwNzI3IDgwLjI2ODYzMDcsMzUuMzUyNzgxNSBDODAuNzc2OTA0OCwzNS4xODY0OTAzIDgxLjIxMjMzMTgsMzQuOTUxMDQ4MyA4MS41NjE2NjY4LDM0LjY1NDY4NzggQzgxLjkxMDE3MzksMzQuMzU4MzI3MiA4Mi4xNzkyMTE1LDM0LjAwNTE2NDIgODIuMzYwNTAxNCwzMy42MDM0MzEgQzgyLjU0MTc5MTQsMzMuMjA0OTkwNyA4Mi42MzI4NTAyLDMyLjc2NzAzNTcgODIuNjMyODUwMiwzMi4zMDI3Mzc1IEM4Mi42MzI4NTAyLDMxLjY4MDM4MDQgODIuNDU2NTI3MSwzMS4xNjY2ODg4IDgyLjEwNzE5MjIsMzAuNzc0MDExIEM4MS43ODI2OTE1LDMwLjQxMDE0NjEgODEuMjg5MzE3OSwzMC4xMzYwMTI2IDgwLjYzODY2MDksMjkuOTU4MTk2MyBMODAuNjM4NjYwOSwyOS45NTgxOTYzIFoiIGlkPSJGaWxsLTE1IiBmaWxsPSIjMzEyQjQ3Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxNC4zNDc4MjYpIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTAuNTI5MzA3OCwxMC41MDc2NjY4IEM5MC40MzUyMjg4LDEwLjU0Mjc4ODUgOTAuMzU2NjkzNCwxMC41ODYwNzggOTAuMjg3OTc0OCwxMC42MzkxNjg5IEM5MC4yMTkyNTYzLDEwLjY5Mzg5MzQgOTAuMTU5NTM2NiwxMC43NTQzMzUzIDkwLjEwNzE3OTYsMTAuODIxMzExNSBDOTAuMDU3Mjc2OSwxMC44ODQyMDM4IDkwLjAxMzkxODgsMTAuOTUwMzYzMiA4OS45NzcxMDUzLDExLjAyMDYwNjUgTDg4LjQ3NDI5NjMsMTQuMTM3NDUwMyBDODguMzQ3NDk0MywxNC4zNzc1ODQ1IDg4LjIzNDU5OTUsMTQuNjA3MTAwNiA4OC4xMzg4ODQ0LDE0LjgxOTQ2NDEgQzg4LjA1OTUzMDksMTQuOTk1ODg5MiA4Ny45ODc1NCwxNS4xNzA2ODA4IDg3LjkyNDU0ODEsMTUuMzQzMDIyIEM4Ny44NTc0NjU3LDE1LjE3NjM5ODMgODcuNzgwNTY2NCwxNS4wMDMyNDAzIDg3LjY5NTQ4NjMsMTQuODI1OTk4NCBDODcuNTg4MzE4MSwxNC42MDYyODM4IDg3LjQ3MjE1MSwxNC4zNzQzMTc0IDg3LjM0ODYyMTMsMTQuMTM5MDgzOSBMODUuODMxMDg3LDExLjAxODE1NjIgQzg1Ljc0NTE4ODgsMTAuODU3MjUgODUuNjM1NTY2NCwxMC43MjI0ODA4IDg1LjUwNjMxMDEsMTAuNjE3OTMyNSBDODUuMzcyOTYzNCwxMC41MTA5MzQgODUuMTkyMTY4MiwxMC40NTc4NDMxIDg0Ljk2NDc0MjYsMTAuNDU3ODQzMSBMODIuNjg4MDMyLDEwLjQ1Nzg0MzEgTDg2LjYxMzk4NzQsMTcuMTU3OTEzOCBMODYuNjEzOTg3NCwyMS4yNjYzMzIxIEw4OS4xOTUwMjI5LDIxLjI2NjMzMjEgTDg5LjE5NTAyMjksMTcuMTU3OTEzOCBMOTMuMDc5MjU2MywxMC41MjcyNjk2IEw5My4xMjA5NzgzLDEwLjQ1Nzg0MzEgTDkwLjgyOTU0MjMsMTAuNDU3ODQzMSBDOTAuNzIwNzM4LDEwLjQ1Nzg0MzEgOTAuNjE5Mjk2MywxMC40NzQxNzg3IDkwLjUyOTMwNzgsMTAuNTA3NjY2OCIgaWQ9IkZpbGwtMTYiIGZpbGw9IiMzMTJCNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOC43MDg0MzgyMiwxLjgxMzAxMjE3IEM4LjY3NDg5NzAzLDEuNjIzNTE4NTIgOC42Nzg5ODc0MSwxLjQ0MjE5MjcgOC43MTk4OTEzLDEuMjY3NDAxMTUgQzguNzYyNDMxMzUsMS4wOTI2MDk1OSA4LjgzMzYwNDEyLDAuOTM0MTUzNjk1IDguOTM1MDQ1NzcsMC43OTAzOTk4OTMgQzkuMDM2NDg3NDEsMC42NDgyNzk2NTYgOS4xNjQ5MjU2MywwLjUyNjU3ODk5NCA5LjMyMDM2MDQxLDAuNDI2MTE0NjkgQzkuNDc1Nzk1MTksMC4zMjQ4MzM2MDIgOS42NTI1LDAuMjU3MDQwNjE1IDkuODUxMjkyOTEsMC4yMjE5MTg5NDggQzEwLjA0NTE3NzMsMC4xODY3OTcyOCAxMC4yMzI1MTcyLDAuMTg5MjQ3NjI5IDEwLjQxMzMxMjQsMC4yMzAwODY3NzggQzEwLjU5NDEwNzYsMC4yNzAxMDkxNDMgMTAuNzU3NzIzMSwwLjMzODcxODkxMiAxMC45MDU3OTUyLDAuNDM2NzMyODY4IEMxMS4wNTMwNDkyLDAuNTM1NTYzNjA3IDExLjE3NzM5NywwLjY1ODg5NzgzNSAxMS4yNzcyMDI1LDAuODA5MTg1OTAxIEMxMS4zNzc4MjYxLDAuOTU3ODQwNDAxIDExLjQ0NDA5MDQsMS4xMjY5MTQ0NyAxMS40Nzc2MzE2LDEuMzE2NDA4MTIgQzExLjUxMTk5MDgsMS41MDUwODQ5OSAxMS41MDg3MTg1LDEuNjg3MjI3NTkgMTEuNDY3ODE0NiwxLjg2NTI4NjI4IEMxMS40MjY5MTA4LDIuMDQzMzQ0OTYgMTEuMzUzMjgzOCwyLjIwMzQzNDQyIDExLjI0OTM4NzksMi4zNDU1NTQ2NiBDMTEuMTQ1NDkyLDIuNDg5MzA4NDYgMTEuMDE1NDE3NiwyLjYxMDE5MjM0IDEwLjg1OTk4MjgsMi43MDczODk1MiBDMTAuNzAzNzMsMi44MDYyMjAyNSAxMC41Mjk0Nzk0LDIuODcxNTYyODkgMTAuMzM0Nzc2OSwyLjkwNjY4NDU2IEMxMC4xMzU5ODQsMi45NDI2MjMwMSA5Ljk0NjE4OTkzLDIuOTQyNjIzMDEgOS43NjYyMTI4MSwyLjkwNDIzNDIxIEM5LjU4NjIzNTcsMi44NjU4NDU0MSA5LjQyMzQzODIyLDIuNzk4MDUyNDIgOS4yNzg2Mzg0NCwyLjY5OTIyMTY5IEM5LjEzMzgzODY3LDIuNjAyMDI0NTEgOS4wMTExMjcsMi40NzcwNTY3MiA4LjkxMDUwMzQzLDIuMzI0MzE4MyBDOC44MTA2OTc5NCwyLjE3MDc2MzExIDguNzQyNzk3NDgsMi4wMDA4NzIyNSA4LjcwODQzODIyLDEuODEzMDEyMTcgWiBNNC4zNjUyNjMxNiwyLjU5MjIyMzEyIEM0LjMzMTcyMTk3LDIuNDAzNTQ2MjUgNC4zMzU4MTIzNiwyLjIyMTQwMzY1IDQuMzc3NTM0MzIsMi4wNDY2MTIxIEM0LjQxODQzODIyLDEuODcxODIwNTQgNC40OTA0MjkwNiwxLjcxMzM2NDY0IDQuNTkxODcwNzEsMS41Njk2MTA4NCBDNC42OTMzMTIzNiwxLjQyNzQ5MDYxIDQuODIxNzUwNTcsMS4zMDY2MDY3MyA0Ljk3NzE4NTM1LDEuMjA2MTQyNDIgQzUuMTMxODAyMDYsMS4xMDQwNDQ1NSA1LjMwOTMyNDk0LDEuMDM2MjUxNTcgNS41MDgxMTc4NSwxLjAwMTEyOTkgQzUuNzAyODIwMzcsMC45NjY4MjUwMTMgNS44OTAxNjAxOCwwLjk2ODQ1ODU3OSA2LjA3MDEzNzMsMS4wMDkyOTc3MyBDNi4yNTA5MzI0OSwxLjA0OTMyMDA5IDYuNDE1MzY2MTMsMS4xMTg3NDY2NSA2LjU2MjYyMDE0LDEuMjE2NzYwNiBDNi43MDk4NzQxNCwxLjMxNDc3NDU2IDYuODM0MjIxOTcsMS40Mzg5MjU1NyA2LjkzNDAyNzQ2LDEuNTg4Mzk2ODUgQzcuMDM0NjUxMDMsMS43Mzc4NjgxMyA3LjEwMTczMzQxLDEuOTA2MTI1NDIgNy4xMzUyNzQ2LDIuMDk1NjE5MDcgQzcuMTY5NjMzODcsMi4yODQyOTU5NCA3LjE2NTU0MzQ4LDIuNDY2NDM4NTQgNy4xMjM4MjE1MSwyLjY0NTMxNDAxIEM3LjA4MzczNTcsMi44MjI1NTU5MSA3LjAxMDkyNjc3LDIuOTgyNjQ1MzcgNi45MDYyMTI4MSwzLjEyNDc2NTYxIEM2LjgwMjMxNjkzLDMuMjY4NTE5NDEgNi42NzIyNDI1NiwzLjM4OTQwMzI5IDYuNTE2ODA3NzgsMy40ODc0MTcyNSBDNi4zNjA1NTQ5MiwzLjU4NjI0Nzk5IDYuMTg2MzA0MzUsMy42NTA3NzM4NCA1Ljk5MjQxOTkxLDMuNjg2NzEyMjkgQzUuNzkzNjI3LDMuNzIxODMzOTYgNS42MDMwMTQ4NywzLjcyMTgzMzk2IDUuNDIzMDM3NzYsMy42ODM0NDUxNiBDNS4yNDMwNjA2NCwzLjY0NTg3MzE0IDUuMDgwMjYzMTYsMy41NzcyNjMzNyA0LjkzNTQ2MzM5LDMuNDc5MjQ5NDIgQzQuNzkwNjYzNjIsMy4zODEyMzU0NiA0LjY2Nzk1MTk1LDMuMjU2MjY3NjcgNC41NjczMjgzOCwzLjEwMzUyOTI1IEM0LjQ2NjcwNDgxLDIuOTUwNzkwODQgNC4zOTk2MjI0MywyLjc4MTcxNjc3IDQuMzY1MjYzMTYsMi41OTIyMjMxMiBaIE0wLjAyMjkwNjE3ODUsMy4zNzE0MzQwNyBDLTAuMDEwNjM1MDExNCwzLjE4Mjc1NzIgLTAuMDA2NTQ0NjIyNDMsMy4wMDE0MzEzOCAwLjAzNDM1OTI2NzcsMi44MjU4MjMwNSBDMC4wNzYwODEyMzU3LDIuNjUxMDMxNDkgMC4xNDcyNTQwMDUsMi40OTI1NzU1OSAwLjI0OTUxMzczLDIuMzQ5NjM4NTggQzAuMzUwMTM3MywyLjIwNjcwMTU2IDAuNDc4NTc1NTE1LDIuMDg1ODE3NjggMC42MzMxOTIyMiwxLjk4NTM1MzM3IEMwLjc4ODYyNzAwMiwxLjg4NDA3MjI4IDAuOTY2MTQ5ODg2LDEuODE1NDYyNTIgMS4xNjU3NjA4NywxLjc4MDM0MDg1IEMxLjM1OTY0NTMxLDEuNzQ2MDM1OTYgMS41NDY5ODUxMywxLjc0NzY2OTUzIDEuNzI3NzgwMzIsMS43ODg1MDg2OCBDMS45MDg1NzU1MSwxLjgyOTM0NzgzIDIuMDcyMTkxMDgsMS44OTg3NzQzOCAyLjIxOTQ0NTA4LDEuOTk1OTcxNTUgQzIuMzY3NTE3MTYsMi4wOTM5ODU1MSAyLjQ5MTA0NjkxLDIuMjE4MTM2NTIgMi41OTA4NTI0LDIuMzY3NjA3OCBDMi42OTE0NzU5NywyLjUxNzA3OTA4IDIuNzU4NTU4MzUsMi42ODUzMzYzOCAyLjc5MjkxNzYyLDIuODc1NjQ2ODEgQzIuODI2NDU4ODEsMy4wNjM1MDY4OSAyLjgyMjM2ODQyLDMuMjQ1NjQ5NDkgMi43ODE0NjQ1MywzLjQyNDUyNDk2IEMyLjc0MDU2MDY0LDMuNjAyNTgzNjUgMi42Njc3NTE3MiwzLjc2MTg1NjMyIDIuNTYzMDM3NzYsMy45MDU2MTAxMyBDMi40NTk5NTk5NSw0LjA0NzczMDM2IDIuMzI5ODg1NTgsNC4xNjg2MTQyNCAyLjE3MzYzMjcyLDQuMjY2NjI4MiBDMi4wMTgxOTc5NCw0LjM2NTQ1ODk0IDEuODQzMTI5MjksNC40MzA4MDE1NyAxLjY0OTI0NDg1LDQuNDY1OTIzMjQgQzEuNDUwNDUxOTUsNC41MDEwNDQ5MSAxLjI1OTgzOTgyLDQuNTAxMDQ0OTEgMS4wNzk4NjI3LDQuNDYzNDcyODkgQzAuODk5ODg1NTg0LDQuNDI1MDg0MDkgMC43MzcwODgxMDEsNC4zNTcyOTExMSAwLjU5MzEwNjQwNyw0LjI1ODQ2MDM3IEMwLjQ0NzQ4ODU1OCw0LjE2MDQ0NjQxIDAuMzI1NTk0OTY2LDQuMDM1NDc4NjIgMC4yMjQxNTMzMTgsMy44ODI3NDAyIEMwLjEyNDM0NzgyNiwzLjczMDAwMTc5IDAuMDU3MjY1NDQ2MiwzLjU2MDkyNzcyIDAuMDIyOTA2MTc4NSwzLjM3MTQzNDA3IEwwLjAyMjkwNjE3ODUsMy4zNzE0MzQwNyBaIiBpZD0iRmlsbC0xOCIgZmlsbD0iIzlBQjFEMSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQxLjk4MDY3NjMsMi4zNjc0MTU0NCBDNDEuOTgwNjc2MywyLjM2NzQxNTQ0IDM4LjMxMjA4NjcsMS44MzE2NzUwNiAzNS44Mzk0MjE1LDMuOTM4NTkyODggQzM0LjA2NDcxODgsMS4wNzYzOTU4MSAzMS4yODE4NDc5LDAgMzEuMjgxODQ3OSwwIEMzMS4yODE4NDc5LDAgMjguNjU2NTI4OCwwLjk3Mzk5ODk0NiAyNi43NDE0MTczLDMuNjk2OTM2MjkgQzI0LjAzOTM2MzEsMS42NjUzODI1NSAyMC40NTg5MzcyLDIuNDQzNTk4NyAyMC40NTg5MzcyLDIuNDQzNTk4NyBDMjAuNDU4OTM3MiwyLjQ0MzU5ODcgMjEuNjY3MTA2NCw1LjcyMjc1NTc5IDIyLjkxNDQ1OTYsOS43ODM0MDU3MyBMMjIuOTI1ODg4Miw5LjgzMDkxNzg3IEwyNS4xMzI0Mjk3LDkuMTY1NzQ3ODYgQzI1LjAxNDg3ODEsOC42NTI5NDQzOCAyMy43MzQ4NzE4LDUuMDY5MDU0MjMgMjMuNjYyMjE4NCw0Ljg2MTgwMjk4IEMyNS44NTA4MDA2LDUuNDU0MDY2NDMgMjcuMjM2OTI5OSw3LjA5MjQxNjIxIDI3LjIzNjkyOTksNy4wOTI0MTYyMSBMMjcuMjQwMTk1Miw3LjA4NTg2MjgxIEMyNy4yNDAxOTUyLDcuMDg1ODYyODEgMjkuMDAxMDIwMywzLjk0MzUwNzkzIDMxLjE4OTYwMjUsMi42MTM5ODcwOCBDMzMuNTc5ODE4NCwzLjkzMDQwMTEzIDM1LjIwNTEzMjYsNy40NjUxNDA3OSAzNS4yMDUxMzI2LDcuNDY1MTQwNzkgQzM1LjIwNTEzMjYsNy40NjUxNDA3OSAzNi43NDMwOTk0LDUuNjcxMTQ3NzcgMzguOTYxODg1OSw0LjkyNDg3OTQ1IEMzOC4yOTk4NDE4LDcuMjA3MTAwNyAzNy45OTg2MTU4LDguODAyODUzMzkgMzcuOTk5NDMyMSw4LjgxNTE0MTAxIEMzOC4wMDY3NzkxLDguODEyNjgzNDggMzkuMDM5NDM3Myw4LjU3Njc2MTEyIDQwLjM1MjkxMzIsOC41NjY5MzEwMiBDNDEuMDkzMzI1LDUuNTE3OTYyMDcgNDEuOTgwNjc2MywyLjM2NzQxNTQ0IDQxLjk4MDY3NjMsMi4zNjc0MTU0NCIgaWQ9IkZpbGwtMjAiIGZpbGw9IiMyRDJBNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNS41OTA2NzMzLDM5LjU4OTM3MiBDMjUuNDI1MTg3MywzOS41ODkzNzIgMjUuMzIwODQxNSwzOS41ODUyODU3IDI1LjI5MjMwOTUsMzkuNTgzNjUxMSBMMjQuMTc4NzQ0LDM5LjUxODI2OTkgTDI0LjIwMDc1NDQsMzguNDAxMDY4OCBDMjQuMjAxNTY5NiwzOC4zODE0NTQ0IDI0LjIzOTA2ODksMzYuNDI1NzM5NSAyNC4yMDA3NTQ0LDM0LjUwMDI2MzQgQzI0LjIwMDc1NDQsMzQuNTAwMjYzNCAyNS40NzQwOTk0LDM0LjY2MzcxNjQgMjYuNTE2NzQyNCwzNC41NjE1NTgzIEMyNi41NDQ0NTkzLDM1LjU3MDA2MzIgMjYuNTM2MzA3MiwzNi40NTg0MzAxIDI2LjUzMTQxNiwzNy4yMTAzMTM4IEMyNy45Mjc4NTY1LDM3LjA0MTE0IDMwLjI2NDIyNDYsMzYuMzkyMjMxNyAzMS4yNjg1NTMxLDM0LjAwNjYzNTQgTDMxLjU1MDYxMjgsMzMuMzM1NjYwOSBMMzIuMjc1MzI3MSwzMy4yOTgwNjY3IEMzNS4wMzcyMzA1LDMzLjE1NDIyODEgMzYuMzIwMzU3OSwzMS43MTU4NDE5IDM2Ljg2ODE3MzUsMzAuNzc3NjIxOCBDMzQuMzUyNDYxMSwyOS4xODU1ODk3IDMzLjM4MjM3MSwyNy43MTM2OTU2IDMzLjM4MjM3MSwyNy43MTM2OTU2IEwzNC4wNzA0MDEzLDI2Ljk0ODczNTcgQzM0LjA4NTA3NDksMjYuOTMxNTczMSAzNS43MDczMjYzLDI1LjA4NDU1NDQgMzYuMjkzNDU2MywyMi41ODQ1NDExIEwzOC41NDc0ODksMjMuMTEzMzExNSBDMzguMDg3NzE1MiwyNS4wODA0NjgxIDM3LjEzNTU1OTYsMjYuNjgyMzA3MyAzNi40ODAxMzc1LDI3LjYxNDgwNjYgQzM3LjY2MzgxMDMsMjguNzM4NTQ1OCAzOS44NTUwNzI1LDI5LjgyMzg3MzYgMzkuODU1MDcyNSwyOS44MjM4NzM2IEMzOS44NTUwNzI1LDI5LjgyMzg3MzYgMzguODg2NjEyOSwzNC43OTEyMDk3IDMzLjA5Mjk3NDQsMzUuNTU3ODA0MiBDMzEuMDc3Nzk1OSwzOS4zMjIxMjY0IDI2Ljc3MzUzMDksMzkuNTg5MzcyIDI1LjU5MDY3MzMsMzkuNTg5MzcyIiBpZD0iRmlsbC0yMSIgZmlsbD0iIzJEMkE0NyI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTIwLjQzODgwNzcsMjkuMTE4ODUxIEwyMC4zOTAzNjksMjcuOTAxNTI4MSBMMjEuNjEwMzY2NywyNy45MDgwODYgQzIxLjYyODQyODUsMjcuOTA4MDg2IDIzLjQwODM0NDMsMjcuOTAxNTI4MSAyNC44ODAzODczLDI3LjE5NjU0NjQgQzI1LjUzODgyNDgsMjYuODgwOTQ0MiAyNS45NjA4MTU5LDI2LjQxNDUwODYgMjYuMDk5NTYzOSwyNS44NDY0MjQ2IEMyNi4yNTIyNjg5LDI1LjIyOTE1NTcgMjYuMDYxNzk4MiwyNC41MDQ1MDAyIDI1LjU3ODIzMjUsMjMuODYxODE5MiBDMjQuNTQ3ODg0NSwyMi40ODc5MjQ3IDIxLjI5NDI4MzgsMjIuOTYzMzc3NSAxOS40MzgwMTU1LDIzLjgxMzQ1NDIgTDE5LjA3ODQyLDIzLjk3OTA0MjkgTDE4LjY5MTczMTYsMjMuODkwNTEwMyBDMTYuODc4OTc2MSwyMy40NzczNTgzIDE1LjU3MDMxMSwyMi41OTAzOTMgMTQuODAyNjgxMywyMS4yNTUwMjY2IEMxMy41Mjg0OTgsMTkuMDM2NzkzNiAxNC4zMjQ4NjI1LDE2LjQ0MDY1NzcgMTQuMzYwMTY1MywxNi4zMzA4MTE3IEwxNC41NTk2NjY5LDE1LjY5Nzk2NzcgTDE1LjIwNjYxMDUsMTUuNTQ3OTU0MiBDMTUuMjIzMDMwNCwxNS41NDMwMzU3IDE1Ljg4NzIxNDgsMTUuMzg3MjgzOSAxOC4yNTAwMzY3LDE0Ljc3NjU3MzEgQzE5LjYwMTM5MzQsMTQuNDI4MTgxIDIwLjIxMDU3MTIsMTMuNTY4MjY3MyAyMC45NzQ5MTcsMTIuNzYyNDU2OSBDMjEuOTY3NDk5MiwxMS43MTY0NjA4IDIzLjA4MjQwOTYsMTAuNzk3NTI1NCAyNS40NTY3MjUzLDEwLjMwNzMxNzMgQzI4LjU2MDkwNTEsOS42NjcwOTU1NiAzMy4zNjYxODUyLDkuNTkwMDM5NDIgMzcuNDYzNzY4MSwxMC41ODc2NzA0IEwzNi42NjgyMjQ2LDEyLjk0NjA4IEMzMy43Mjc0MjI3LDEyLjE3NzE1ODEgMzAuNzA3ODA1NCwxMi4xMDkxMTkyIDI3LjY4OTAwOSwxMi4zNTY2ODI1IEMyNS4zMjM3MjQyLDEyLjU1MDk2MjQgMjMuOTY5MDgzNSwxMy4xMjU2MDQ0IDIyLjc3NTM1NzcsMTQuMjQyOTE4NCBDMjEuODI3MTA5MiwxNS4xMzA3MDM0IDIwLjkxOTkxMDQsMTYuNDk0NzYwOSAxOC44MzQ1ODQ3LDE3LjAzMDg3NDkgQzE3LjY5MDkzOTUsMTcuMzI2ODAzMiAxNi45MzgwODc2LDE3LjUxNzgwNDEgMTYuNDYxOTEwOSwxNy42MzY2NjczIEMxNi4zNzQ4ODU1LDE4LjI2NTQxMjUgMTYuMzQ2MTUwNywxOS4yNzEyNDEgMTYuODMyMTc5NCwyMC4xMDczODIgQzE3LjIxODA0NjcsMjAuNzcyMTk2MSAxNy44OTc4MzAxLDIxLjI0ODQ2ODYgMTguODU1OTMwNSwyMS41Mjg4MjE4IEMyMS4zNDc2NDg1LDIwLjUxODg5NDYgMjUuNTU5MzQ5NiwxOS45NTQ5MDkzIDI3LjQ0NTE3MzcsMjIuNDY0MTUyMSBDMjguMzQ4MjY3NSwyMy42NjgzNTkxIDI4LjY4NDA1NDIsMjUuMTAyOTE0OCAyOC4zNjU1MDg0LDI2LjQwMDU3MjkgQzI4LjA1ODQ1NjUsMjcuNjUwNjg1OCAyNy4xNzkxNzE1LDI4LjY3ODY0NzQgMjUuODg4NTY4NCwyOS4yOTU5MTYyIEMyNC45MTg5NzQsMjkuNzYwNzEyMyAyMy44ODYxNjMxLDI5Ljk5NTk3OTQgMjMuMDc1ODQxNiwzMC4xMTQ4NDI2IEMyMy4zNTgyNjM3LDMwLjYxNTcwNzQgMjMuODQwMTg3NCwzMS4xNjAwMTg5IDI2LjMwMzE3MDUsMzEuMTYwMDE4OSBDMjguNzY2MTUzNywzMS4xNjAwMTg5IDI5LjcwMTI2NjMsMzAuMjUzMzc5NyAzMC41NjQxMzE0LDI5LjIyNjIzNzggTDMyLjM1MTQzNjEsMzAuNzIzMDk0MiBDMzEuMDUzNDQ0LDMyLjI2NjY3NjEgMjkuOTMzNjA3NywzMy40NzgyNjA5IDI1Ljk1NzUzMTksMzMuNDc4MjYwOSBDMjEuMzgyMTMwMiwzMy40NzgyNjA5IDIwLjUwNzc3MTIsMzAuODQzNTk2OSAyMC40Mzg4MDc3LDI5LjExODg1MSIgaWQ9IkZpbGwtMjIiIGZpbGw9IiMyRDJBNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNS4wMDY2ODQzLDE3LjUzNjIzMTkgTDIzLjkxMzA0MzUsMTUuMzk5MTIwMyBDMjQuMDAxNjI3NiwxNS4zNTA2ODQ4IDI2LjEwNTI5MjQsMTQuMjQ2ODY0NiAyOC4xNjQyNTEyLDE1LjQxMDE2NyBMMjcuMDI4Mzg4MSwxNy41MjQzMzU0IEMyNi4wOTYxODU2LDE2Ljk5NjY0MzEgMjUuMDE3NDQ2OCwxNy41MzAyODM3IDI1LjAwNjY4NDMsMTcuNTM2MjMxOSIgaWQ9IkZpbGwtMjMiIGZpbGw9IiMyRDJBNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOS4yMTE5NDcyLDIwLjE5MzIzNjcgTDM3LjgxNzYwNywxOC4zMDcxNzM4IEM0MS4yNTkxODYyLDE2LjYwMjMyMjQgNDEuMTc5NzQ2MSwxMy42MzMwNTMxIDQwLjc0MTk5NzcsMTIuMTcyNzk2NyBDMzkuMjAyODQ0NywxMi4wMTAyNzUxIDM2LjkwNzM1NTIsMTIuNDE4MjA0MiAzNS4zMzE3OTIxLDE1LjY0MzQ0NSBMMzMuMjEyNTYwNCwxNC42NDcxODc3IEMzNS4wMTE1NDg5LDEwLjk1OTU3MyAzOC4yNDA0NjAzLDkuMjMzNTkzODUgNDEuODUzMzMyNCwxMC4wMTYxMzUzIEw0Mi40MDk0MTM1LDEwLjEzODAyNjQgTDQyLjY1NjgzNjUsMTAuNjQxODQzNCBDNDMuOTQ1MjU2NSwxMy4yNjQxMjkxIDQzLjU4MTk4MzMsMTcuODMxNzk4MSAzOS4yMTE5NDcyLDIwLjE5MzIzNjciIGlkPSJGaWxsLTI0IiBmaWxsPSIjMkQyQTQ3Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzYuNzM3MjI5OSwzOS4zMjM2NzE1IEMzNC43ODg4MzE1LDM5LjMyMzY3MTUgMzIuODQ0NTI4MSwzOC44Mjk2OTY5IDMxLjA4Njk1NjUsMzcuODUzMjczOCBMMzIuMjEyMjYxLDM1LjgwNjU3MjMgQzM0LjI2OTU4NjIsMzYuOTUwMTIzNSAzNi42NDcxNCwzNy4yNzAzODM3IDM4Ljg3OTczMSwzNi43MzExMjgxIEMzOC43MjQ5NDAyLDM2LjIzODgwMDEgMzguNTY4NTExNCwzNS42OTk1NDQ1IDM4LjQyMTA5MTYsMzQuOTkzOTg0MSBMMzguMjA1Njk0OSwzMy45NTY2Mzc0IEwzOS4yMTE0MjU1LDMzLjYzODg0NzEgQzQxLjU3NTA1NjQsMzIuODkyMTIyMiA0Mi43MzIzMDE4LDMxLjMwODkzMzYgNDMuMjU3MjgwMSwzMC4yNzI0MTAyIEM0MC42Mjc0NzQ2LDI4LjcwMDc0NzcgMzkuODA4NDc1NywyNy4zMzczNzc4IDM5LjgwODQ3NTcsMjcuMzM3Mzc3OCBDMzkuODA4NDc1NywyNy4zMzczNzc4IDQxLjQwNzk4MDYsMjYuMDExODc5MyA0My4wMjMwNDY0LDIzLjc5NDc1NjYgQzQxLjg1MjY5NywyMy4wMDUyMjA1IDQwLjcwOTM3NDUsMjEuODk3ODk0MSA0MC4wODg1NzM0LDIxLjA3OTU0MjkgQzQwLjA4ODU3MzQsMjEuMDc5NTQyOSA0MC41MzczODQ4LDIwLjg0NjU1MTUgNDEuMTAwODU2LDIwLjQwMzYyMDkgQzQxLjY4OTcxNjIsMTkuOTQwMTA4MSA0MS45Mzg2OTE5LDE5LjY2MTgzNTcgNDEuOTM4NjkxOSwxOS42NjE4MzU3IEM0Mi41NjE5NSwyMC40ODQzMDM1IDQzLjkzNTQxMTIsMjEuNzE5MjQgNDQuOTg1MzY3NywyMi4yNDg2MTYxIEw0Ni4wNzg3MzEzLDIyLjc5NjEwNDYgQzQ2LjA3ODczMTMsMjIuNzk2MTA0NiA0NS4yODUxMjEzLDI1LjEzNzU0NDIgNDMuMDY3MjcyMywyNy40MzI4Nzk1IEM0NC4xNTg5OTc5LDI4LjM1MzMxODkgNDYuMjMxODg0MSwyOS4yMTUzMDQ2IDQ2LjIzMTg4NDEsMjkuMjE1MzA0NiBDNDYuMjMxODg0MSwyOS4yMTUzMDQ2IDQ0Ljk1OTE1OTgsMzMuNzA4MDAzNiA0MC45MzU0MTgyLDM1LjQ4MzAxOSBDNDEuMDI4Nzg0MSwzNS44MTMxNTg3IDQxLjEyNTQyNiwzNi4xMTExOSA0MS4yMjM3MDU4LDM2LjQxODI3NzUgQzQxLjMwMzE0ODcsMzYuNjYyNzk1IDQxLjM4MTc3MjYsMzYuOTA2NDg5MSA0MS40NTk1Nzc1LDM3LjE2NTgyNTggTDQxLjc3MjQzNTEsMzguMjE2MzQ1MSBMNDAuNzUxMTQzNSwzOC41OTgzNTIxIEMzOS40NTM4NDkyLDM5LjA4MzI3MDUgMzguMDk0MzExMSwzOS4zMjM2NzE1IDM2LjczNzIyOTksMzkuMzIzNjcxNSIgaWQ9IkZpbGwtMjUiIGZpbGw9IiMyRDJBNDciPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOS40Njg0NTI0LDI3LjM2NzE0OTggQzE3LjcyNTAzMzUsMjcuMzY3MTQ5OCAxNi40ODA1NTksMjYuNDkyMzI1IDE1Ljk0MjAyOSwyNS44MTY0NzY3IEwxNy43NDgxMjUyLDI0LjI5NjAyNzkgQzE3Ljg3MTgzMDQsMjQuNDQxMjcyNCAxOS4wMjcyMzcxLDI1LjY2ODcxMzYgMjEuMzU4NjY4MiwyNC40NTYzODQ1IEMyMi45MzU0OTczLDIzLjYzMjc3MzEgMjQuMzc1NDI2MSwyMy40Mzc5OTQ1IDI1LjYzNTU2OTksMjMuODcyMDQ4NiBDMjcuMTg5MzA3NSwyNC40MDUxNzEyIDI3LjgzMDkyNTIsMjUuNjkyMjIxNCAyNy44OTg1NTA3LDI1LjgzNzQ2NTggTDI1Ljc4NTY2NTYsMjYuODY1OTMwNiBDMjUuNjU0NTM4MSwyNi42MTQ5MDEyIDI0LjgzMzk2MDEsMjUuMzI0NDkyNyAyMi40MjY2NTY2LDI2LjU3Nzk2MDQgQzIxLjMzMzkyNzEsMjcuMTQ4ODYzNCAyMC4zMzkzMzcyLDI3LjM2NzE0OTggMTkuNDY4NDUyNCwyNy4zNjcxNDk4IiBpZD0iRmlsbC0yNiIgZmlsbD0iIzJEMkE0NyI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
        }
        alt="Vládní sliby"
        className={css`
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
          Programové prohlášení druhé vlády Andreje Babiše (<a
            href={
              // tslint:disable-next-line:max-line-length
              'https://www.vlada.cz/assets/jednani-vlady/programove-prohlaseni/Programove-prohlaseni-vlady-cerven-2018.pdf'
            }
            target="_blank"
          >
            zdroj
          </a>)
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
      <a
        href="https://www.darujme.cz/projekt/1200037"
        className={css`
          font-weight: bold;
          margin-right: 15px;
        `}
      >
        Podpořte Demagog.cz
      </a>
    </div>
  );
};
