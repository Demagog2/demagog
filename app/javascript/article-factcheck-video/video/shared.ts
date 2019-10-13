interface IVideo {
  getTime: () => number;
  goToTime: (time: number) => void;
  setSize: (width: number, height: number) => void;
}

export { IVideo };
