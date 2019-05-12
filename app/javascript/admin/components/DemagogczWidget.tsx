import * as React from 'react';

interface IProps {
  url: string;
}

class DemagogczWidget extends React.Component<IProps> {
  public componentDidMount() {
    const initializeWidgets = (window as any).__demagogczInitializeWidgets__;

    initializeWidgets();
  }

  public render() {
    return (
      <div>
        <demagogcz-widget data-url={this.props.url} />
      </div>
    );
  }
}

export default DemagogczWidget;
