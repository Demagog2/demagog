import * as React from 'react';

import { css } from 'emotion';
import YouTube from 'react-youtube';

import type { IVideo } from './shared';

interface IProps {
  onReady: (video: IVideo) => void;
  videoId: string;
}

class YoutubeVideo extends React.Component<IProps> {
  public player: any | null = null;

  public handleYoutubeReady = (event) => {
    this.player = event.target;
    this.props.onReady({
      getTime: this.getTime,
      goToTime: this.goToTime,
    });
  };

  public getTime = () => {
    if (this.player !== null) {
      return this.player.getCurrentTime();
    }
  };

  public goToTime = (time) => {
    if (this.player !== null) {
      this.player.seekTo(time, true);
    }
  };

  public render() {
    const { videoId } = this.props;

    return (
      <div
        className={css`
          width: 100%;
          height: 0;
          padding-top: 56.25%; /* aspect ratio 16/9 */
          position: relative;
        `}
      >
        <YouTube
          containerClassName={css`
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            iframe {
              width: 100%;
              height: 100%;
            }
          `}
          videoId={videoId}
          opts={{
            playerVars: {
              autoplay: 1,
              playsinline: 1,
              rel: 0,
            },
          }}
          onReady={this.handleYoutubeReady}
        />
      </div>
    );
  }
}

export default YoutubeVideo;
