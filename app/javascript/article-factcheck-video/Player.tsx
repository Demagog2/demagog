import styled from '@emotion/styled';
import { css } from 'emotion';
import { orderBy, padStart } from 'lodash';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
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
          background: #ffffff;
          z-index: 100;
          min-width: 800px;
        `}
      >
        <HeaderBar>
          <a href="/" className={'ms-2 d-flex aling-items-center'} >
            <svg
              width="40"
              height="40"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.3257 4.75202C14.8196 2.44077 12.1325 0.894531 9.05665 0.894531C4.33283 0.894531 0.506348 4.52252 0.506348 9.00128C0.506348 13.48 4.33283 17.108 9.05665 17.108C12.1252 17.108 14.8098 15.5687 16.3184 13.2668L8.25957 9.03373L16.3257 4.75202Z"
                fill="#111827"
              />
            </svg>
          </a>
          <h1 className={'mx-2 fs-4'} >
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
        <StatementsColumn
          className={'scroll-vertical"}
          ref={(statementsColumn) => (this.statementsColumn = statementsColumn)}
        >
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
  color: #111827;
  font-size: 18px;
  line-height: 1.2;
  font-weight: bold;
  cursor: pointer;

  &:hover,
  &:active {
    color: #25ad23;
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
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  text-align: center;

  &:hover,
  &:active {
    text-decoration: underline;
    color: #25ad23
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
          {
              (() => {
                if (statement.assessment.veracity.key == 'true') {
                  return  (
                    <div className={'d-flex align-items-center mb-2'} >
                      <span
                        className={'w-25px h-25px d-flex align-items-center justify-content-center bg-primary rounded-circle me-2'}
                      >
                        <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0.0507812 6.4745L1.38245 5.10858L6.00525 9.6629L15.5667 0.135742L16.9326 1.50166L6.00525 12.3947L0.0507812 6.4745Z"
                            fill="white"
                          ></path>
                        </svg>
                      </span>
                      <span className={'fs-6 text-uppercase fs-600 text-primary'}>
                        Pravda
                      </span>
                  </div>
                  );
                }
                if (statement.assessment.veracity.key == 'untrue') {
                  return (
                    <div className={'d-flex align-items-center mb-2'} >
                        <span
                          className={'w-25px h-25px d-flex align-items-center justify-content-center bg-red rounded-circle me-2'}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.8642 1.58955L11.4983 0.223633L6.80319 4.90351L2.1081 0.223633L0.742188 1.58955L5.43348 6.26562L0.742188 10.9417L2.1081 12.3076L6.80319 7.62773L11.4983 12.3076L12.8642 10.9417L8.17291 6.26562L12.8642 1.58955Z"
                              fill="white"
                            ></path>
                          </svg>
                        </span>
                        <span className={'fs-6 text-uppercase fs-600 text-red'}>
                          Nepravda
                        </span>
                    </div>
                  );
                }
                if (statement.assessment.veracity.key == 'misleading') {
                  return (
                    <div className={'d-flex align-items-center mb-2'} >
                        <span
                          className={'w-25px h-25px d-flex align-items-center justify-content-center bg-secondary rounded-circle me-2'}
                        >
                          <svg
                            width="4"
                            height="22"
                            viewBox="0 0 5 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.38458 25.9392C1.77482 25.9392 1.25598 25.7199 0.822722 25.2866C0.389467 24.8534 0.170166 24.3292 0.170166 23.7248C0.170166 23.1204 0.389467 22.5962 0.822722 22.1629C1.25598 21.7297 1.78016 21.5104 2.38458 21.5104C2.989 21.5104 3.51319 21.7297 3.94644 22.1629C4.3797 22.5962 4.599 23.1204 4.599 23.7248C4.599 24.1259 4.49737 24.495 4.29946 24.832C4.09621 25.169 3.82877 25.4364 3.49714 25.6397C3.16551 25.8429 2.79109 25.9392 2.38458 25.9392ZM4.05877 0.532227L3.81272 18.6541H0.956443L0.710397 0.532227H4.05877Z"
                              fill="white"
                            ></path>
                          </svg>
                        </span>
                        <span className={'fs-6 text-uppercase fs-600 text-secondary'}>
                          Zavádějící
                        </span>
                    </div>
                  );
                }
                if (statement.assessment.veracity.key == 'unverifiable') {
                  return (
                    <div className={'d-flex align-items-center mb-2'}>
                        <span
                          className={'w-25px h-25px d-flex align-items-center justify-content-center bg-gray rounded-circle me-2'}
                        >
                          <svg
                            width="12"
                            height="22"
                            viewBox="0 0 15 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.21838 18.8279V18.6782C5.23443 17.111 5.40024 15.8647 5.71047 14.934C6.0207 14.0086 6.46466 13.2544 7.04233 12.6821C7.62001 12.1098 8.30466 11.5803 9.11233 11.0935C9.59373 10.7993 10.0323 10.4463 10.4174 10.0398C10.8026 9.63328 11.1074 9.16258 11.3321 8.6277C11.5567 8.09281 11.6691 7.50444 11.6691 6.85723C11.6691 6.05491 11.4819 5.35421 11.1021 4.76584C10.7223 4.17747 10.2195 3.71747 9.58838 3.40189C8.95721 3.08096 8.25652 2.92049 7.48094 2.92049C6.80698 2.92049 6.15977 3.05956 5.53396 3.3377C4.90815 3.61584 4.38931 4.05444 3.9721 4.65351C3.55489 5.25258 3.30884 6.03886 3.24466 7.007H0.142334C0.20652 5.61095 0.570241 4.41816 1.2335 3.42328C1.8914 2.4284 2.76861 1.66886 3.85443 1.14468C4.94024 0.620491 6.14908 0.358398 7.48094 0.358398C8.92512 0.358398 10.1821 0.647236 11.2519 1.21956C12.3216 1.79189 13.1507 2.58351 13.7391 3.58375C14.3274 4.58398 14.6216 5.72328 14.6216 7.007C14.6216 7.91095 14.4826 8.72398 14.2098 9.45677C13.937 10.1896 13.5412 10.8421 13.0277 11.4144C12.5142 11.9868 11.8991 12.4949 11.177 12.9389C10.4549 13.3882 9.87721 13.8642 9.43861 14.3616C9.00535 14.8591 8.68977 15.4475 8.49187 16.1268C8.29396 16.8061 8.18698 17.6565 8.17094 18.6728V18.8226H5.21838V18.8279ZM6.79628 26.113C6.18652 26.113 5.66768 25.8937 5.23443 25.4605C4.80117 25.0272 4.58187 24.503 4.58187 23.8986C4.58187 23.2942 4.80117 22.77 5.23443 22.3368C5.66768 21.9035 6.19187 21.6842 6.79628 21.6842C7.4007 21.6842 7.92489 21.9035 8.35814 22.3368C8.7914 22.77 9.0107 23.2942 9.0107 23.8986C9.0107 24.2998 8.90907 24.6689 8.71117 25.0058C8.50791 25.3428 8.24582 25.6102 7.90884 25.8135C7.57721 26.0168 7.2028 26.113 6.79628 26.113Z"
                              fill="white"
                            ></path>
                          </svg>
                        </span>
                        <span className={'fs-6 text-uppercase fs-600 text-gray'} >
                          Neověřitelné
                        </span>
                    </div>
                  );
                }
              })()}

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
  color: #ffffff;

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
  let color = '#111827';
  if (highlighted) {
    color = '#172032';
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
  color: #111827;
  font-size: 16px;
  font-weight: normal;
  cursor: pointer;
  text-decoration: underline;

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
  background-color: ${(props: any) => (props.highlighted ? '#EFF2F5' : 'transparent')};
  padding: 13px 15px 18px 0;
`;
