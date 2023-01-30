import * as React from 'react';

import { css, cx } from 'emotion';
import { connect, DispatchProp } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router';

import { fetchCurrentUser } from './actions/currentUser';
import hoffImg from './images/hoff.png';
import { IState } from './reducers';

import { ArticleEdit } from './components/articles/ArticleEdit';
import { ArticleNew } from './components/articles/ArticleNew';
import { ArticleSingleStatementEdit } from './components/articles/ArticleSingleStatementEdit';
import ArticleSingleStatementNew from './components/articles/ArticleSingleStatementNew';
import Articles from './components/articles/Articles';

import Availability from './components/Availability';

import Bodies from './components/Bodies';
import BodyEdit from './components/BodyEdit';
import { BodyNew } from './components/BodyNew';

import FlashMessages from './components/FlashMessages';
import Header from './components/Header';
import Images from './components/Images';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import Notifications from './components/Notifications';
import Sidebar from './components/Sidebar';

import { SpeakerEdit } from './components/SpeakerEdit';
import { SpeakerNew } from './components/SpeakerNew';
import Speakers from './components/Speakers';

import { PageEdit } from './components/pages/PageEdit';
import { PageNew } from './components/pages/PageNew';
import Pages from './components/pages/Pages';

import Media from './components/media/Media';
import { MediumEdit } from './components/media/MediumEdit';
import { MediumNew } from './components/media/MediumNew';

import MediaPersonalities from './components/mediaPersonalities/MediaPersonalities';
import { MediaPersonalityEdit } from './components/mediaPersonalities/MediaPersonalityEdit';
import { MediaPersonalityNew } from './components/mediaPersonalities/MediaPersonalityNew';

import { SourceDetailContainer } from './components/sources/SourceDetailContainer';
import SourceEdit from './components/SourceEdit';
import SourceNew from './components/SourceNew';
import Sources from './components/Sources';
import SourceStats from './components/SourceStats';

import StatementDetail from './components/StatementDetail';
import { StatementNew } from './components/StatementNew';
import StatementsFromTranscript from './components/StatementsFromTranscript';
import StatementsSort from './components/StatementsSort';
import StatementsVideoMarks from './components/StatementsVideoMarks';

import OverallStats from './components/OverallStats';

import { UserEdit } from './components/users/UserEdit';
import { UserNew } from './components/users/UserNew';
import { UsersPageContainer } from './components/users/UsersPageContainer';
import { UsersSortOnAboutUsPageContainer } from './components/users/UsersSortOnAboutUsPageContainer';

import { TagsContainer } from './components/tags/TagsContainer';
import { TagsNewContainer } from './components/tags/TagsNewContainer';

import WebContents from './components/webContents/WebContents';
import WebContentEdit from './components/webContents/WebContentEdit';

const hoff = css`
  background-image: url(${hoffImg});
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
`;

interface IProps extends DispatchProp {
  currentUser: IState['currentUser']['user'];
}

class App extends React.Component<IProps> {
  public componentDidMount() {
    this.props.dispatch(fetchCurrentUser());
  }

  public render() {
    if (!this.props.currentUser) {
      // We need current user & roles loaded because of the authorization
      return <Loading />;
    }

    return (
      <BrowserRouter>
        {/* top padding because of the fixed position header */}
        <div
          style={{ paddingTop: 50 }}
          className={cx({ [hoff]: this.props.currentUser.email === 'tvrdon.honza@gmail.com' })}
        >
          <Header />
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flexGrow: 1, flexShrink: 1, paddingLeft: 30, paddingRight: 30 }}>
              <FlashMessages />
              <Routes>
                <Route path="/admin" element={<Navigate to="/admin/sources" />} />

                <Route path="/admin/articles" element={<Articles />} />
                <Route path="/admin/articles/new" element={<ArticleNew />} />
                <Route path="/admin/articles/edit/:id" element={<ArticleEdit />} />
                <Route
                  path="/admin/articles/new-single-statement"
                  element={<ArticleSingleStatementNew />}
                />
                <Route
                  path="/admin/articles/edit-single-statement/:id"
                  element={<ArticleSingleStatementEdit />}
                />

                <Route path="/admin/images" element={<Images />} />

                <Route path="/admin/sources" element={<Sources />} />
                <Route path="/admin/sources/new" element={<SourceNew />} />
                <Route path="/admin/sources/edit/:id" element={<SourceEdit />} />

                <Route path="/admin/sources/:sourceId" element={<SourceDetailContainer />} />
                <Route
                  path="/admin/sources/:sourceId/statements-from-transcript"
                  element={<StatementsFromTranscript />}
                />
                <Route path="/admin/sources/:sourceId/statements/new" element={<StatementNew />} />
                <Route
                  path="/admin/sources/:sourceId/statements-sort"
                  element={<StatementsSort />}
                />
                <Route path="/admin/sources/:sourceId/stats" element={<SourceStats />} />
                <Route
                  path="/admin/sources/:sourceId/statements-video-marks"
                  element={<StatementsVideoMarks />}
                />

                <Route path="/admin/statements/:id" element={<StatementDetail />} />

                <Route path="/admin/bodies" element={<Bodies />} />
                <Route path="/admin/bodies/new" element={<BodyNew />} />
                <Route path="/admin/bodies/edit/:id" element={<BodyEdit />} />

                <Route path="/admin/speakers" element={<Speakers />} />
                <Route path="/admin/speakers/new" element={<SpeakerNew />} />
                <Route path="/admin/speakers/edit/:id" element={<SpeakerEdit />} />

                <Route path="/admin/media" element={<Media />} />
                <Route path="/admin/media/new" element={<MediumNew />} />
                <Route path="/admin/media/edit/:id" element={<MediumEdit />} />

                <Route path="/admin/media-personalities" element={<MediaPersonalities />} />
                <Route path="/admin/media-personalities/new" element={<MediaPersonalityNew />} />
                <Route
                  path="/admin/media-personalities/edit/:id"
                  element={<MediaPersonalityEdit />}
                />

                <Route path="/admin/pages" element={<Pages />} />
                <Route path="/admin/pages/new" element={<PageNew />} />
                <Route path="/admin/pages/edit/:id" element={<PageEdit />} />

                <Route path="/admin/web-contents" element={<WebContents />} />
                <Route path="/admin/web-contents/edit/:id" element={<WebContentEdit />} />

                <Route path="/admin/users" element={<UsersPageContainer />} />
                <Route path="/admin/users/new" element={<UserNew />} />
                <Route path="/admin/users/edit/:id" element={<UserEdit />} />
                <Route
                  path="/admin/users/sort-on-about-us-page"
                  element={<UsersSortOnAboutUsPageContainer />}
                />

                <Route path="/admin/tags" element={<TagsContainer />} />
                <Route path="/admin/tags/new" element={<TagsNewContainer />} />

                <Route path="/admin/notifications/:tab?" element={<Notifications />} />

                <Route path="/admin/availability" element={<Availability />} />

                <Route path="/admin/overall-stats" element={<OverallStats />} />

                <Route element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(App);
