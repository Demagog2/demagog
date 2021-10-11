import styled from '@emotion/styled';
import { css } from 'emotion';
import { orderBy, padStart } from 'lodash';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import demagogLogoIconOnly from './demagog-logo-icon-only.png';
import { IArticleStatementsQueryResult } from './types';
import { IVideo } from './video/shared';
import AudioOnlyVideo from './video/AudioOnlyVideo';
import FacebookVideo from './video/FacebookVideo';
import YoutubeVideo from './video/YoutubeVideo';

interface IPlayerProps {
  article: IArticleStatementsQueryResult['article'];
  statements: IArticleStatementsQueryResult['article']['segments'][0]['statements'];
  onRequestClose: () => void;
}

interface IPlayerState {
  highlightStatementId: string | null;
  time: number;
}

function formatTime(timeInSeconds: number): string {
  return `${Math.floor(timeInSeconds / 60)}:${padStart(`${timeInSeconds % 60}`, 2, '0')}`;
}

export class Player extends React.Component<IPlayerProps, IPlayerState> {
  public video: IVideo | null = null;
  public getVideoTimeIntervalHandle: number | null = null;
  public statementsColumn: HTMLDivElement | null = null;
  public statementContainers: { [statementId: string]: HTMLDivElement } = {};
  public headMetaViewport: HTMLMetaElement | null = null;
  public headMetaViewportContentBefore: string | null = null;
  public state: IPlayerState = {
    highlightStatementId: null,
    time: 0,
  };

  public componentDidMount() {
    document.body.style.position = 'fixed';

    this.headMetaViewport = document.head.querySelector('meta[name=viewport]');
    if (this.headMetaViewport) {
      this.headMetaViewportContentBefore = this.headMetaViewport.getAttribute('content');
      this.headMetaViewport.setAttribute('content', 'width=800');
    }

    this.getVideoTimeIntervalHandle = window.setInterval(this.getVideoTime, 100);
  }

  public componentWillUnmount() {
    document.body.style.position = 'static';

    if (this.headMetaViewport && this.headMetaViewportContentBefore) {
      this.headMetaViewport.setAttribute('content', this.headMetaViewportContentBefore);
    }

    if (this.getVideoTimeIntervalHandle !== null) {
      window.clearInterval(this.getVideoTimeIntervalHandle);
      this.getVideoTimeIntervalHandle = null;
    }
  }

  public componentDidUpdate(_, prevState) {
    if (prevState.time !== this.state.time && this.state.time !== null) {
      const foundStatement = this.props.statements.find((statement) => {
        const timing = statement.statementVideoMark;

        return timing && this.state.time >= timing.start && this.state.time <= timing.stop;
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
        top: this.statementContainers[this.state.highlightStatementId].offsetTop - 15,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  public render() {
    const { article, onRequestClose, statements } = this.props;
    const { highlightStatementId } = this.state;

    const statementsSortedByTimingsStart = orderBy(
      statements.filter((s) => s.statementVideoMark),
      [(s) => s.statementVideoMark.start],
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
        <HeaderBar>
          <a
            href="/"
            className={css`
              margin-left: 15px;
            `}
          >
            <img src={demagogLogoIconOnly} alt="Demagog.cz" />
          </a>
          <h1
            className={css`
              margin: 0 0 0 15px;
            `}
          >
            {article.title}
          </h1>

          <HeaderBarCloseButton type="button" onClick={onRequestClose}>
            <HeaderBarCloseButtonIcon>×</HeaderBarCloseButtonIcon> Zavřít přehrávač
          </HeaderBarCloseButton>
        </HeaderBar>
        <VideoColumn>
          {article.source.videoType === 'youtube' && (
            <YoutubeVideo onReady={this.onVideoReady} videoId={article.source.videoId} />
          )}
          {article.source.videoType === 'audio' && (
            <AudioOnlyVideo
              onReady={this.onVideoReady}
              posterImageUrl={article.illustration !== null ? article.illustration : undefined}
              videoId={article.source.videoId}
            />
          )}
          {article.source.videoType === 'facebook' && (
            <FacebookVideo onReady={this.onVideoReady} videoId={article.source.videoId} />
          )}
        </VideoColumn>
        <StatementsColumn ref={(statementsColumn) => (this.statementsColumn = statementsColumn)}>
          {statementsSortedByTimingsStart.map((statement, index) => {
            const timing = statement.statementVideoMark;
            const highlighted = highlightStatementId === statement.id;
            const lastStatement = index + 1 === statementsSortedByTimingsStart.length;
            const formattedStartTime = formatTime(timing.start);
            return (
              <StatementContainer
                key={statement.id}
                highlighted={highlighted}
                ref={(container) => (this.statementContainers[statement.id] = container)}
              >
                <TimeContainer>
                  <TimeButton
                    type="button"
                    onClick={() => this.goToTimeOfStatement(statement)}
                    data-tip={`Kliknutím skočte na čas ${formattedStartTime}`}
                    data-for={`statement-${statement.id}`}
                  >
                    {formattedStartTime}
                  </TimeButton>
                  <ReactTooltip place="top" id={`statement-${statement.id}`} effect="solid" />
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

  public goToTimeOfStatement = (statement) => {
    const { start } = statement.statementVideoMark;
    if (this.video !== null && start) {
      this.video.goToTime(start);
    }
  };
}

const HeaderBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-bottom: 2px solid #d8e1e8;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderBarCloseButton = styled.button`
  display: block;
  margin: 0 15px 0 auto;
  padding: 0 15px;
  border: none;
  background: none;
  color: #f26538;
  font-size: 18px;
  line-height: 1.2;
  font-family: Lato, sans-serif;
  font-weight: bold;
  cursor: pointer;

  &:hover,
  &:active {
    color: #3c325c;
  }
`;

const HeaderBarCloseButtonIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  margin-right: 2px;
`;

const VideoColumn = styled.div`
  position: absolute;
  top: 62px;
  bottom: 0;
  left: 0;
  right: 60%;
  padding-top: 15px;

  @media (min-width: 1200px) {
    right: 50%;
  }
`;

const StatementsColumn = styled.div`
  position: absolute;
  top: 62px;
  bottom: 0;
  left: 40%;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 400px;

  @media (min-width: 1200px) {
    left: 50%;
  }
`;

const TimeContainer = styled.div`
  flex: 0 0 60px;
  padding: 0 5px;
  position: relative;
`;

const TimeButton = styled.button`
  display: block;
  padding: 9px 0;
  width: 100%;
  background: none;
  border: none;
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: normal;
  color: #f26538;
  cursor: pointer;
  text-align: center;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const TimeLine = styled.div`
  position: absolute;
  top: 39px;
  bottom: -46px;
  left: 50%;
  margin-left: -1px;
  border-left: 2px solid #d8e1e8;
`;

interface IDisplayStatementProps {
  highlighted: boolean;
  statement: IArticleStatementsQueryResult['article']['segments'][0]['statements'][0];
}

interface IDisplayStatementState {
  showExplanation: boolean;
}

class DisplayStatement extends React.Component<IDisplayStatementProps, IDisplayStatementState> {
  public explanationContainer: HTMLDivElement | null = null;
  public state = {
    showExplanation: false,
  };

  public componentDidUpdate(_, prevState) {
    if (
      !prevState.showExplanation &&
      this.state.showExplanation &&
      this.explanationContainer !== null
    ) {
      // Make sure the links in explanation are opened in new window
      this.explanationContainer.querySelectorAll('a').forEach((el) => {
        el.setAttribute('target', '_blank');
      });
    }
  }

  public render() {
    const { highlighted, statement } = this.props;
    const { showExplanation } = this.state;
    const speakerFullName =
      `${statement.sourceSpeaker.firstName} ${statement.sourceSpeaker.lastName}` +
      (statement.sourceSpeaker.body ? ` (${statement.sourceSpeaker.body.shortName})` : '');

    return (
      <div>
        <SpeakerContainer>
          <SpeakerAvatarMask>
            <img src={statement.sourceSpeaker.speaker.avatar} alt={speakerFullName} />
          </SpeakerAvatarMask>
          <SpeakerFullName>{speakerFullName}</SpeakerFullName>
        </SpeakerContainer>
        <StatementContent
          highlighted={highlighted}
          dangerouslySetInnerHTML={{ __html: convertNewlinesToBr(statement.content) }}
        />
        <VeracityContainer>
          <span className={'veracity-label ' + statement.assessment.veracity.key}>
            {' '}
            {statement.assessment.veracity.name}
          </span>
        </VeracityContainer>
        <ShortExplanationContainer>
          <p>{statement.assessment.shortExplanation}</p>
        </ShortExplanationContainer>
        <ToggleExplanationButton type="button" onClick={this.toggleExplanation}>
          {showExplanation ? 'skrýt' : 'zobrazit'} celé odůvodnění
        </ToggleExplanationButton>
        {showExplanation && (
          <ExplanationContainer
            dangerouslySetInnerHTML={{ __html: statement.assessment.explanationHtml }}
            ref={(explanationContainer) => (this.explanationContainer = explanationContainer)}
          />
        )}
      </div>
    );
  }

  public toggleExplanation = () => {
    this.setState({ showExplanation: !this.state.showExplanation });
  };
}

const SpeakerContainer = styled.div`
  display: flex;
  align-items: center;
`;
const SpeakerAvatarMask = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
`;
const SpeakerFullName = styled.h3`
  margin: 0 0 0 8px;
`;
const StatementContent = styled.blockquote`
  background-color: ${(props: any) => getStatementContentColor(props)};
  border-radius: 5px;
  padding: 8px 15px 10px;
  margin: 14px 0 0 0;
  letter-spacing: 0;
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    bottom: 100%;
    left: 9px;
    height: 0;
    width: 0;
    border: solid transparent;
    border-bottom-color: ${(props: any) => getStatementContentColor(props)};
    border-width: 9px;
    pointer-events: none;
  }
`;
const getStatementContentColor = ({ highlighted }) => {
  let color = '#d7e5ef';
  if (highlighted) {
    color = '#f4f9fd';
  }
  return color;
};
const VeracityContainer = styled.div`
  margin-top: 13px;
`;
const ShortExplanationContainer = styled.div`
  margin-top: 5px;

  p {
    margin: 0;
  }
`;
const ToggleExplanationButton = styled.button`
  display: block;
  margin: 5px 0 0 0;
  padding: 0;
  border: none;
  background: none;
  color: #f26538;
  font-size: 16px;
  font-family: Lato, sans-serif;
  font-weight: normal;
  cursor: pointer;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

const ExplanationContainer = styled.div`
  margin-top: 5px;
`;

export const convertNewlinesToBr = (text) => text.replace(/(?:\r\n|\r|\n)/g, '<br />');

const StatementContainer = styled.div`
  display: flex;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: ${(props: any) => (props.highlighted ? '#FAE4DD' : 'transparent')};
  padding: 13px 15px 18px 0;
`;
