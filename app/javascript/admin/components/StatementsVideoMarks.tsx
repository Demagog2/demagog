import { Button, Classes, Intent, NonIdealState } from '@blueprintjs/core';
import { css } from 'emotion';
import { Field, Formik } from 'formik';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router';

import { IVideo } from '../../article-factcheck-video/video/shared';
import YoutubeVideo from '../../article-factcheck-video/video/YoutubeVideo';
import * as ResultTypes from '../operation-result-types';
import { GetSourceWithStatementsAndVideoMarks } from '../queries/queries';
import Breadcrumbs from './Breadcrumbs';
import Loading from './Loading';
import { StatementInput } from './statementVideoMarks/StatementInput';
import { VideoModalContainer } from './statementVideoMarks/VideoModalContainer';

export default function StatementsVideoMarks(props: RouteComponentProps<{ sourceId: string }>) {
  const { data, loading, refetch } = useQuery<
    ResultTypes.GetSourceWithStatementsAndVideoMarks,
    ResultTypes.GetSourceWithStatementsAndVideoMarksVariables
  >(GetSourceWithStatementsAndVideoMarks, {
    fetchPolicy: 'cache-and-network',
    variables: { id: parseInt(props.match.params.sourceId, 10), includeUnpublished: true },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <NonIdealState title="Zdroj nenalezen" />;
  }

  return (
    <StatementsVideoMarksInner
      onSourceChange={() => {
        refetch();
      }}
      onStatementsChange={() => {
        refetch();
      }}
      source={data.source}
      statements={data.source.statements}
    />
  );
}

function StatementsVideoMarksInner({
  onSourceChange,
  source,
  statements,
}: {
  onSourceChange: () => void;
  onStatementsChange: () => void;
  source: ResultTypes.GetSourceWithStatementsAndVideoMarks['source'];
  statements: ResultTypes.GetSourceWithStatementsAndVideoMarks['source']['statements'];
}) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const breadcrumbs = [
    { href: '/admin/sources', text: 'Seznam diskuzí' },
    { href: `/admin/sources/${source.id}`, text: source.name },
    { text: 'Propojení s videozáznamem' },
  ];

  const hasVideo = !!source.videoType && !!source.videoId;
  const videoType = source.videoType;
  const videoId = source.videoId;

  let video: IVideo | null = null;
  const handleVideoReady = React.useCallback((v) => {
    video = v;
  }, []);

  const [videoTime, setVideoTime] = React.useState(0);
  React.useEffect(() => {
    const intervalHandle = window.setInterval(() => {
      if (video !== null) {
        setVideoTime(video.getTime());
      }
    }, 200);
    return () => {
      window.clearInterval(intervalHandle);
    };
  }, [setVideoTime]);

  const handleGoToMark = React.useCallback((mark: number) => {
    if (video !== null) {
      video.goToTime(mark);
    }
  }, []);

  const initialValues = React.useMemo(() => {
    return {
      marks: statements.reduce((carry, statement) => {
        // TODO: fill start & stop from actual statement marks properties
        carry[statement.id] = {
          start: 0,
          stop: 0,
        };
        return carry;
      }, {}),
    };
  }, [statements]);

  const onSubmit = React.useCallback((values) => {
    // TODO: add actual saving of video marks
    // tslint:disable-next-line:no-console
    console.log('-----', { values });
  }, []);

  return (
    <>
      {showVideoModal && (
        <VideoModalContainer
          source={source}
          onRequestClose={() => setShowVideoModal(false)}
          onSaveCompleted={() => {
            onSourceChange();
            setShowVideoModal(false);
          }}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div
              className={css`
                position: absolute;
                top: 107px;
                left: 260px;
                right: 30px;
                bottom: 40px;
                display: flex;
                flex-direction: column;
              `}
            >
              <div
                style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}
              >
                <h2 className={Classes.HEADING}>Propojení videozáznamu s výroky z diskuze</h2>
                {hasVideo && (
                  <Button type="submit" intent={Intent.PRIMARY}>
                    Uložit časování výroků
                  </Button>
                )}
              </div>
              <div
                className={css`
                  margin-top: 10px;
                  flex: 1 0 0px;
                  display: flex;
                  flex-direction: column;
                `}
              >
                {!hasVideo && (
                  <div>
                    <p>Diskuze zatím nemá přiřazený videozáznam</p>
                    <Button
                      intent={Intent.PRIMARY}
                      onClick={() => setShowVideoModal(true)}
                      text="Přiřadit videozáznam"
                    />
                  </div>
                )}
                {hasVideo && (
                  <div
                    className={css`
                      flex: 1 0 0px;
                      overflow-y: auto;
                      display: flex;
                    `}
                  >
                    <div style={{ flex: '1' }}>
                      {videoType === 'youtube' && (
                        <YoutubeVideo onReady={handleVideoReady} videoId={videoId || ''} />
                      )}
                      <p style={{ marginTop: 15 }}>
                        Videozáznam {videoType}:{videoId}
                      </p>
                      <Button
                        onClick={() => setShowVideoModal(true)}
                        text="Přiřadit jiný videozáznam"
                      />
                    </div>
                    <div
                      className={css`
                        flex: 1;
                        overflow-y: auto;
                      `}
                    >
                      {statements.map((statement) => (
                        <Field
                          key={statement.id}
                          name={`marks.${statement.id}`}
                          component={StatementInput}
                          onGoToMark={handleGoToMark}
                          statement={statement}
                          videoTime={videoTime}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
