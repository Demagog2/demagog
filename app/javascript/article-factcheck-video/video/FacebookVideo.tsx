import * as React from 'react';

import { default as ReactFacebookPlayer } from 'react-facebook-player';

import type { IVideo } from './shared';

interface IProps {
  onReady: (video: IVideo) => void;
  videoId: string;
}

class FacebookVideo extends React.Component<IProps> {
  public player: any | null = null;

  public handleReactFacebookPlayerReady = (_, player) => {
    this.player = player;

    if (this.player.isMuted()) {
      this.player.unmute();
    }

    this.props.onReady({
      getTime: this.getTime,
      goToTime: this.goToTime,
    });
  };

  public getTime = () => {
    if (this.player !== null) {
      return this.player.getCurrentPosition();
    }
  };

  public goToTime = (time) => {
    if (this.player !== null) {
      this.player.seek(time);
      this.player.play();
    }
  };

  public render() {
    const { videoId } = this.props;

    return (
      <ReactFacebookPlayer
        appId={appId}
        videoId={videoId}
        onReady={this.handleReactFacebookPlayerReady}
      />
    );
  }
}

export default FacebookVideo;

const appId = '150764505690468';
