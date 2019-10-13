import * as React from 'react';

import YouTube from 'react-youtube';

import { IVideo } from './shared';

interface IProps {
  height: number;
  onReady: (video: IVideo) => void;
  videoId: string;
  width: number;
}

class YoutubeVideo extends React.Component<IProps> {
  public player: any | null = null;

  public shouldComponentUpdate(nextProps) {
    // we propagate width & height changes ourselves using setSize
    return nextProps.videoId !== this.props.videoId || nextProps.onReady !== this.props.onReady;
  }

  public handleYoutubeReady = (event) => {
    this.player = event.target;
    this.props.onReady({
      getTime: this.getTime,
      goToTime: this.goToTime,
      setSize: this.setSize,
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

  public setSize = (width, height) => {
    if (this.player !== null) {
      this.player.setSize(width, height);
    }
  };

  public render() {
    const { height, videoId, width } = this.props;

    return (
      <YouTube
        videoId={videoId}
        opts={{
          width,
          height,
          playerVars: {
            // autoplay: 1,
            playsinline: 1,
            rel: 0,
          },
        }}
        onReady={this.handleYoutubeReady}
      />
    );
  }
}

export default YoutubeVideo;
