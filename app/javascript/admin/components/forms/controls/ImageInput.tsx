import * as React from 'react';

import Dropzone, { ImageFile } from 'react-dropzone';

export type ImageValueType = string | ImageFile | null;

interface IImageInputProps {
  renderImage: (src: string | null) => React.ReactNode;
  label: string;
  name: string;
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
    const { label, name } = this.props;
    const { value } = this.state;

    return (
      <div>
        <label htmlFor={name}>{label}:</label>
        <div className="image-input-control">
          {value !== null && (
            <div className="preview">
              {this.props.renderImage(value instanceof File ? value.preview || null : value)}
            </div>
          )}

          <div className="actions">
            <Dropzone
              accept="image/jpeg, image/png"
              multiple={false}
              onDrop={this.onDrop}
              style={{}}
              className="dropzone"
            >
              <button type="button" className="btn btn-secondary">
                {value !== null ? 'Vybrat novou fotku' : 'Vybrat fotku'}
              </button>
            </Dropzone>
            {value !== null && (
              <button type="button" className="btn btn-secondary" onClick={this.onRemoveClick}>
                Odstranit tuto fotku
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
