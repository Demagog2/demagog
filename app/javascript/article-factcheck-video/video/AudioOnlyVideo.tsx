import * as React from 'react';

import { css } from 'emotion';

import type { IVideo } from './shared';
import audioOnlyEmptyPoster from './audio-only-empty-poster.svg';

interface IProps {
  onReady: (video: IVideo) => void;
  posterImageUrl?: string;
  videoId: string;
}

class AudioOnlyVideo extends React.Component<IProps> {
  public videoElRef;

  constructor(props) {
    super(props);

    this.videoElRef = React.createRef();
  }

  public componentDidMount() {
    this.videoElRef.current.addEventListener('canplay', this.handleCanPlay);
  }

  public componentWillUnmount() {
    this.videoElRef.current.removeEventListener('canplay', this.handleCanPlay);
  }

  public handleCanPlay = () => {
    this.props.onReady({
      getTime: this.getTime,
      goToTime: this.goToTime,
    });
  };

  public getTime = () => {
    if (this.videoElRef.current) {
      return this.videoElRef.current.currentTime;
    }
  };

  public goToTime = (time) => {
    if (this.videoElRef.current) {
      this.videoElRef.current.currentTime = time;
      this.videoElRef.current.play();
    }
  };

  public render() {
    const { posterImageUrl, videoId } = this.props;

    return (
      <div>
        <video
          autoPlay
          controls
          controlsList="nodownload nofullscreen"
          src={videoId}
          poster={posterImageUrl || audioOnlyEmptyPoster}
          ref={this.videoElRef}
          className={css`
            width: 100%;
          `}
        />
      </div>
    );
  }
}

export default AudioOnlyVideo;
