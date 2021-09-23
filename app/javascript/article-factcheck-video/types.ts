// FIXME: Should be generated
export interface IArticleStatementsQueryResult {
  article: {
    id: string;
    title: string;
    illustration: string | null;
    source: {
      id: string;
      videoType: string;
      videoId: string;
    };
    segments: Array<{
      segmentType: string;
      statements: Array<{
        id: string;
        content: string;
        important: boolean;
        statementVideoMark: {
          start: number;
          stop: number;
        };
        assessment: {
          id: string;
          veracity: {
            id: string;
            key: string;
            name: string;
          };
          shortExplanation: string;
          explanationHtml: string;
        };
        sourceSpeaker: {
          id: string;
          firstName: string;
          lastName: string;
          speaker: {
            avatar: string;
          };
        };
      }>;
    }>;
  };
}
