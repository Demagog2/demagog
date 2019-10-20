import styled from '@emotion/styled';
import { css } from 'emotion';
import gql from 'graphql-tag';
import isHotkey from 'is-hotkey';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import 'whatwg-fetch';
import playIcon from './play-icon.svg';
import { IArticleStatementsQueryResult } from './types';
import { Player } from './video/Player';

const articleStatementsQuery = gql`
  query getArticle($articleId: Int!) {
    article(id: $articleId) {
      id
      title
      statements {
        id
        content
        important
        statementVideoMark {
          start
          stop
        }
        assessment {
          id
          veracity {
            id
            key
            name
          }
          shortExplanation
          explanationHtml
        }
        speaker {
          id
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

interface IProps {
  articleIllustrationImageHtml: string;
}

function ArticleFactcheckVideoApp(props: IProps) {
  const [isPlayerOpen, setPlayerOpen] = useState<boolean>(false);
  const { data } = useQuery<IArticleStatementsQueryResult>(articleStatementsQuery, {
    variables: { articleId: 774 },
  });

  function openPlayer() {
    document.location.hash = 'video';
  }

  function closePlayer() {
    document.location.hash = '';
  }

  function handleHashChange() {
    setPlayerOpen(document.location.hash === '#video');
  }

  function handleKeyDown(e) {
    if (isHotkey('esc', e)) {
      closePlayer();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Execute on mount
  useEffect(() => {
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const { articleIllustrationImageHtml } = props;

  if (!data) {
    return null;
  }

  const { article } = data;

  return (
    <>
      {isPlayerOpen && article && <Player article={article} onRequestClose={closePlayer} />}
      <div
        className={css`
          position: relative;
        `}
      >
        <div
          className={css`
            img {
              display: block;
            }
          `}
          dangerouslySetInnerHTML={{ __html: articleIllustrationImageHtml }}
        ></div>
        {article !== null && (
          <OpenPlayerButton type="button" onClick={openPlayer}>
            <OpenPlayerButtonOverlay>
              <OpenPlayerButtonOverlayPlayIcon src={playIcon} alt="Spustit videozáznam" />
              <OpenPlayerButtonOverlayText>
                Spustit videozáznam propojený s&nbsp;ověřením
              </OpenPlayerButtonOverlayText>
            </OpenPlayerButtonOverlay>
          </OpenPlayerButton>
        )}
      </div>
    </>
  );
}

export default ArticleFactcheckVideoApp;

const OpenPlayerButton = styled.button`
  display: block;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

const OpenPlayerButtonOverlay = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -115px;
  margin-top: -35px;
  width: 230px;
  height: 70px;
  background-color: rgba(40, 40, 40, 0.8);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OpenPlayerButtonOverlayPlayIcon = styled.img`
  margin-left: 20px;
`;

const OpenPlayerButtonOverlayText = styled.div`
  margin-left: 15px;
  margin-right: 20px;
  color: white;
  font-size: 14px;
  line-height: 1.25;
  font-family: Lato, sans-serif;
  font-weight: normal;
  text-align: left;
`;
