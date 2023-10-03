import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import type { FieldProps } from 'formik';
import { Field } from 'formik';
import type { ImageFile } from 'react-dropzone';
import Dropzone from 'react-dropzone';

export type ImageValueType = string | ImageFile | null;

interface IImageInputProps {
  additionalActions?: any;
  renderImage: (src: string | null) => React.ReactNode;
  value: ImageValueType;
  onChange: (file: ImageValueType) => any;
}

interface IImageInputState {
  value: ImageValueType;
}

class ImageInput extends React.Component<IImageInputProps, IImageInputState> {
  public onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      this.props.onChange(acceptedFiles[0]);
    }
  };

  public onRemoveClick = () => {
    this.props.onChange(null);
  };

  public render() {
    const { additionalActions, value } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        {value !== null && (
          <div style={{ marginRight: 10 }}>
            {this.props.renderImage(value instanceof File ? value.preview || null : value)}
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <Dropzone
            accept="image/jpeg, image/png, image/gif"
            multiple={false}
            onDrop={this.onDrop}
            style={{}}
            className="dropzone"
          >
            <button
              type="button"
              className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.FOLDER_OPEN))}
            >
              {value !== null ? 'Vybrat nový obrázek' : 'Vybrat obrázek'}
            </button>
            <div>
              <small className={Classes.TEXT_MUTED}>
                Formáty .png, .jpg, .jpeg nebo .gif. Velikost max 4 MB.
              </small>
            </div>
          </Dropzone>

          {value !== null && (
            <button
              type="button"
              className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.TRASH))}
              style={{ marginTop: 7 }}
              onClick={this.onRemoveClick}
            >
              Odstranit tento obrázek
            </button>
          )}

          {additionalActions}
        </div>
      </div>
    );
  }
}

interface IImageFieldProps extends Partial<IImageInputProps> {
  name: string;
  renderImage: (src: string | null) => React.ReactNode;
}

const ImageField = (props: IImageFieldProps) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => (
        <ImageInput
          onChange={(value) => { form.setFieldValue(name, value); }}
          value={field.value}
          {...restProps}
        />
      )}
    />
  );
};

export default ImageField;
