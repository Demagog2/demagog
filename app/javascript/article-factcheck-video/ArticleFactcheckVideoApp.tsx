import * as React from 'react';

import styled from '@emotion/styled';
import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { css } from 'emotion';
import gql from 'graphql-tag';
import { orderBy } from 'lodash';
import 'whatwg-fetch';

import { IVideo } from './video/shared';
import YoutubeVideo from './video/YoutubeVideo';

const apolloLink = new HttpLink({ uri: '/graphql', fetch });

const articleStatementsQuery = gql`
  query {
    article(id: 774) {
      id
      statements {
        id
        content
        important
        assessment {
          id
          veracity {
            id
            name
          }
          shortExplanation
          explanationHtml
        }
        speaker {
          id
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

interface IArticleStatementsQueryResult {
  article: {
    id: string;
    statements: Array<{
      id: string;
      content: string;
      important: boolean;
      assessment: {
        id: string;
        veracity: {
          id: string;
          name: string;
        };
        shortExplanation: string;
        explanationHtml: string;
      };
      speaker: {
        id: string;
        firstName: string;
        lastName: string;
        avatar: string;
      };
    }>;
  };
}

interface IProps {
  articleIllustrationImageHtml: string;
}

interface IState {
  article: IArticleStatementsQueryResult['article'] | null;
  isPlayerOpen: boolean;
}

class ArticleFactcheckVideoApp extends React.Component<IProps, IState> {
  public state = {
    article: null,
    isPlayerOpen: false,
  };

  public componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();

    makePromise(execute(apolloLink, { query: articleStatementsQuery })).then((data) => {
      this.setState({ article: data.data.article });
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  public render() {
    const { articleIllustrationImageHtml } = this.props;
    const { article, isPlayerOpen } = this.state;

    return (
      <>
        {isPlayerOpen && article !== null && (
          <Player article={article} onRequestClose={this.closePlayer} />
        )}
        <div
          className={css`
            position: relative;
          `}
        >
          <div dangerouslySetInnerHTML={{ __html: articleIllustrationImageHtml }}></div>
          {article !== null && (
            <button
              type="button"
              className={css`
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -115px;
                margin-top: -35px;
                width: 230px;
                height: 70px;
                background-color: rgba(40, 40, 40, 0.8);
                border: none;
                color: white;
                font-size: 14px;
                font-family: Lato, sans-serif;
                font-weight: normal;
                cursor: pointer;
              `}
              onClick={this.openPlayer}
            >
              Play Videozáznam propojený s ověřením
            </button>
          )}
        </div>
      </>
    );
  }

  public openPlayer = () => {
    document.location.hash = 'video';
  };

  public closePlayer = () => {
    document.location.hash = '';
  };

  public handleHashChange = () => {
    this.setState({ isPlayerOpen: document.location.hash === '#video' });
  };
}

export default ArticleFactcheckVideoApp;

interface IPlayerProps {
  article: IArticleStatementsQueryResult['article'];
  onRequestClose: () => void;
}

interface IPlayerState {
  highlightStatementId: string | null;
  time: number;
}

class Player extends React.Component<IPlayerProps, IPlayerState> {
  public video: IVideo | null = null;
  public getVideoTimeIntervalHandle: number | null = null;
  public statementsColumn: HTMLDivElement | null = null;
  public statementContainers: { [statementId: string]: HTMLDivElement } = {};
  public state: IPlayerState = {
    highlightStatementId: null,
    time: 0,
  };

  public componentDidMount() {
    document.body.style.position = 'fixed';

    this.getVideoTimeIntervalHandle = window.setInterval(this.getVideoTime, 100);
    console.log('------', {
      statementContainers: this.statementContainers,
      statementsColumn: this.statementsColumn,
    });
  }

  public componentWillUnmount() {
    document.body.style.position = null;

    if (this.getVideoTimeIntervalHandle !== null) {
      window.clearInterval(this.getVideoTimeIntervalHandle);
      this.getVideoTimeIntervalHandle = null;
    }
  }

  public componentDidUpdate(_, prevState) {
    if (prevState.time !== this.state.time && this.state.time !== null) {
      const foundStatement = this.props.article.statements.find((statement) => {
        const timing = timings[statement.id];

        if (timing) {
          return (
            this.state.time >= parseTimingTime(timing[0]) &&
            this.state.time <= parseTimingTime(timing[1])
          );
        } else {
          return false;
        }
      });

      this.setState({
        highlightStatementId: foundStatement ? foundStatement.id : null,
      });
    }

    if (
      prevState.highlightStatementId !== this.state.highlightStatementId &&
      this.state.highlightStatementId !== null &&
      this.statementsColumn !== null &&
      this.statementContainers[this.state.highlightStatementId] !== undefined
    ) {
      this.statementsColumn.scroll({
        top: this.statementContainers[this.state.highlightStatementId].offsetTop,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  public render() {
    const { article, onRequestClose } = this.props;
    const { highlightStatementId } = this.state;

    const statementsSortedByTimingsStart = orderBy(
      article.statements.filter((s) => !!timings[s.id]),
      [(s) => parseTimingTime(timings[s.id][0])],
      ['asc'],
    );

    return (
      <div
        className={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f4f9fd;
          z-index: 100;
          min-width: 800px;
        `}
      >
        <div
          className={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            border-bottom: 2px solid #d8e1e8;
          `}
        >
          <button type="button" onClick={onRequestClose}>
            Zavřít
          </button>
        </div>
        <VideoColumn>
          <YoutubeVideo
            height={300}
            onReady={this.onVideoReady}
            videoId="LHX2OdsApCc"
            width={400}
          />
        </VideoColumn>
        <StatementsColumn ref={(statementsColumn) => (this.statementsColumn = statementsColumn)}>
          {statementsSortedByTimingsStart.map((statement, index) => {
            const timing = timings[statement.id];
            const highlighted = highlightStatementId === statement.id;
            const lastStatement = index + 1 === statementsSortedByTimingsStart.length;
            return (
              <StatementContainer
                key={statement.id}
                highlighted={highlighted}
                ref={(container) => (this.statementContainers[statement.id] = container)}
              >
                <TimeContainer>
                  <TimeButton type="button" onClick={() => this.goToTimeOfStatement(statement.id)}>
                    {timing[0]}
                  </TimeButton>
                  {!lastStatement && <TimeLine />}
                </TimeContainer>
                <div
                  className={css`
                    flex: 1;
                  `}
                >
                  <DisplayStatement highlighted={highlighted} statement={statement} />
                </div>
              </StatementContainer>
            );
          })}
        </StatementsColumn>
      </div>
    );
  }

  public onVideoReady = (video: IVideo) => {
    this.video = video;
  };

  public getVideoTime = () => {
    if (this.video !== null) {
      this.setState({ time: this.video.getTime() });
    }
  };

  public goToTimeOfStatement = (statementId: string) => {
    const timing = timings[statementId];
    if (this.video !== null && timing) {
      this.video.goToTime(parseTimingTime(timing[0]));
    }
  };
}

const VideoColumn = styled.div`
  position: absolute;
  top: 62px;
  bottom: 0;
  left: 0;
  right: 50%;
  padding-top: 15px;
`;

const StatementsColumn = styled.div`
  position: absolute;
  top: 62px;
  bottom: 0;
  left: 50%;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 15px;
  padding-right: 15px;
`;

const TimeContainer = styled.div`
  flex: 0 0 60px;
  padding: 0 5px;
  position: relative;
`;

const TimeButton = styled.button`
  background: none;
  border: none;
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: normal;
  color: #f26538;
  cursor: pointer;
  width: 100%;
  text-align: center;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const TimeLine = styled.div`
  position: absolute;
  top: 30px;
  bottom: -40px;
  left: 50%;
  margin-left: -1px;
  border-left: 2px solid #d8e1e8;
`;

const StatementContainer = styled.div`
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: ${(props: any) => (props.highlighted ? '#FAE4DD' : 'transparent')};
  padding: 13px 15px 18px 0;
`;

// TODO: move to server
const timings = {
  18598: ['0:46', '1:03'],
  18599: ['1:06', '1:12'],
  18601: ['2:33', '3:01'],
  18602: ['3:19', '3:32'],
};

const parseTimingTime = (time: string): number => {
  if (typeof time === 'number') {
    return time;
  }

  const parts = time.split(':');

  let seconds = 0;
  if (parts.length > 0) {
    // Float, because seconds can be '1.3'
    seconds += parseFloat(parts.pop() as string);
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop() as string, 10) * 60;
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop() as string, 10) * 3600;
  }

  return seconds;
};

const DisplayStatement = ({
  highlighted,
  statement,
}: {
  highlighted: boolean;
  statement: IArticleStatementsQueryResult['article']['statements'][0];
}) => {
  return (
    <div>
      <div>{statement.content}</div>
      <div>{statement.assessment.veracity.name}</div>
      <div>{statement.assessment.shortExplanation}</div>
      <div dangerouslySetInnerHTML={{ __html: statement.assessment.explanationHtml }}></div>
    </div>
  );
};
