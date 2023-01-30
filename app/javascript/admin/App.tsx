import * as React from 'react';

import { css, cx } from 'emotion';
import { hot } from 'react-hot-loader/root';
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
import BodyNew from './components/BodyNew';

import FlashMessages from './components/FlashMessages';
import Header from './components/Header';
import Images from './components/Images';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import Notifications from './components/Notifications';
import Sidebar from './components/Sidebar';

import SpeakerEdit from './components/SpeakerEdit';
import SpeakerNew from './components/SpeakerNew';
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
import StatementNew from './components/StatementNew';
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
                <Route path="/admin">
                  <Navigate to="/admin/sources" />
                </Route>

                <Route path="/admin/articles" exact component={Articles} />
                <Route path="/admin/articles/new" exact component={ArticleNew} />
                <Route path="/admin/articles/edit/:id" exact component={ArticleEdit} />
                <Route
                  path="/admin/articles/new-single-statement"
                  exact
                  component={ArticleSingleStatementNew}
                />
                <Route
                  path="/admin/articles/edit-single-statement/:id"
                  exact
                  component={ArticleSingleStatementEdit}
                />

                <Route path="/admin/images" exact component={Images} />

                <Route path="/admin/sources" exact component={Sources} />
                <Route path="/admin/sources/new" exact component={SourceNew} />
                <Route path="/admin/sources/edit/:id" exact component={SourceEdit} />

                <Route path="/admin/sources/:sourceId" exact component={SourceDetailContainer} />
                <Route
                  path="/admin/sources/:sourceId/statements-from-transcript"
                  exact
                  component={StatementsFromTranscript}
                />
                <Route
                  path="/admin/sources/:sourceId/statements/new"
                  exact
                  component={StatementNew}
                />
                <Route
                  path="/admin/sources/:sourceId/statements-sort"
                  exact
                  component={StatementsSort}
                />
                <Route path="/admin/sources/:sourceId/stats" exact component={SourceStats} />
                <Route
                  path="/admin/sources/:sourceId/statements-video-marks"
                  exact
                  component={StatementsVideoMarks}
                />

                <Route path="/admin/statements/:id" exact component={StatementDetail} />

                <Route path="/admin/bodies" exact component={Bodies} />
                <Route path="/admin/bodies/new" exact component={BodyNew} />
                <Route path="/admin/bodies/edit/:id" exact component={BodyEdit} />

                <Route path="/admin/speakers" exact component={Speakers} />
                <Route path="/admin/speakers/new" exact component={SpeakerNew} />
                <Route path="/admin/speakers/edit/:id" exact component={SpeakerEdit} />

                <Route path="/admin/media" exact component={Media} />
                <Route path="/admin/media/new" exact component={MediumNew} />
                <Route path="/admin/media/edit/:id" exact component={MediumEdit} />

                <Route path="/admin/media-personalities" exact component={MediaPersonalities} />
                <Route
                  path="/admin/media-personalities/new"
                  exact
                  component={MediaPersonalityNew}
                />
                <Route
                  path="/admin/media-personalities/edit/:id"
                  exact
                  component={MediaPersonalityEdit}
                />

                <Route path="/admin/pages" exact component={Pages} />
                <Route path="/admin/pages/new" exact component={PageNew} />
                <Route path="/admin/pages/edit/:id" exact component={PageEdit} />

                <Route path="/admin/web-contents" exact component={WebContents} />
                <Route path="/admin/web-contents/edit/:id" exact component={WebContentEdit} />

                <Route path="/admin/users" exact component={UsersPageContainer} />
                <Route path="/admin/users/new" exact component={UserNew} />
                <Route path="/admin/users/edit/:id" exact component={UserEdit} />
                <Route
                  path="/admin/users/sort-on-about-us-page"
                  exact
                  component={UsersSortOnAboutUsPageContainer}
                />

                <Route path="/admin/tags" exact component={TagsContainer} />
                <Route path="/admin/tags/new" exact component={TagsNewContainer} />

                <Route path="/admin/notifications/:tab?" exact component={Notifications} />

                <Route path="/admin/availability" exact component={Availability} />

                <Route path="/admin/overall-stats" exact component={OverallStats} />

                <Route component={NotFound} />
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

export default hot(connect(mapStateToProps)(App));
