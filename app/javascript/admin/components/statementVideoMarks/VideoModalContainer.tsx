import * as React from 'react';
import { useMutation } from 'react-apollo';
import type {
  UpdateSourceVideoFields,
  UpdateSourceVideoFieldsVariables,
} from '../../operation-result-types';
import * as mutations from '../../queries/mutations';
import { VideoModal } from './VideoModal';

interface IVideoModalContainerProps {
  source: {
    id: string;
    videoType?: string | null;
    videoId?: string | null;
  };
  onRequestClose: () => void;
}

export function VideoModalContainer(props: IVideoModalContainerProps) {
  const [updateVideoFields] = useMutation<
  UpdateSourceVideoFields,
  UpdateSourceVideoFieldsVariables
  >(mutations.UpdateSourceVideoFields, {
    onCompleted() {
      props.onRequestClose();
    },
  });

  return (
    <VideoModal
      source={{
        video_id: props.source.videoId || '',
        video_type: props.source.videoType || 'youtube',
      }}
      onRequestClose={props.onRequestClose}
      onSubmit={async(values) => {
        await updateVideoFields({
          variables: {
            id: props.source.id,
            sourceVideoFieldsInput: {
              videoId: values.video_id,
              videoType: values.video_type,
            },
          },
        });
      }}
    />
  );
}
