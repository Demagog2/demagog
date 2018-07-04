import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import Dropzone, { ImageFile } from 'react-dropzone';

export type ImageValueType = string | ImageFile | null;

interface IImageInputProps {
  renderImage: (src: string | null) => React.ReactNode;
  defaultValue: ImageValueType;
  onChange(file: ImageValueType);
}

interface IImageInputState {
  value: ImageValueType;
}

export default class ImageInput extends React.Component<IImageInputProps, IImageInputState> {
  constructor(props: IImageInputProps) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  public onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      this.props.onChange(acceptedFiles[0]);

      this.setState({
        value: acceptedFiles[0],
      });
    }
  };

  public onRemoveClick = () => {
    this.props.onChange(null);

    this.setState({
      value: null,
    });
  };

  public render() {
    const { value } = this.state;

    return (
      <div style={{ display: 'flex' }}>
        {value !== null && (
          <div style={{ marginRight: 10 }}>
            {this.props.renderImage(value instanceof File ? value.preview || null : value)}
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <Dropzone
            accept="image/jpeg, image/png"
            multiple={false}
            onDrop={this.onDrop}
            style={{}}
            className="dropzone"
          >
            <button
              type="button"
              className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.FOLDER_OPEN))}
            >
              {value !== null ? 'Vybrat novou fotku' : 'Vybrat fotku'}
            </button>
          </Dropzone>
          {value !== null && (
            <button
              type="button"
              className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.TRASH))}
              style={{ marginTop: 7 }}
              onClick={this.onRemoveClick}
            >
              Odstranit tuto fotku
            </button>
          )}
        </div>
      </div>
    );
  }
}
