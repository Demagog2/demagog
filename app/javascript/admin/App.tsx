import * as React from 'react';

import createBrowserHistory from 'history/createBrowserHistory';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router';

import { fetchCurrentUser } from './actions/currentUser';
import { fetchRoles } from './actions/roles';
import { IState } from './reducers';

import Loading from './components/Loading';

import FlashMessages from './components/FlashMessages';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Sidebar from './components/Sidebar';

import Bodies from './components/Bodies';
import BodyEdit from './components/BodyEdit';
import BodyNew from './components/BodyNew';

import SpeakerEdit from './components/SpeakerEdit';
import SpeakerNew from './components/SpeakerNew';
import Speakers from './components/Speakers';

import SourceDetail from './components/SourceDetail';
import SourceEdit from './components/SourceEdit';
import SourceNew from './components/SourceNew';
import Sources from './components/Sources';

import StatementDetail from './components/StatementDetail';
import StatementNew from './components/StatementNew';
import StatementsFromTranscript from './components/StatementsFromTranscript';
import StatementsSort from './components/StatementsSort';

import UserEdit from './components/UserEdit';
import UserNew from './components/UserNew';
import Users from './components/Users';

const history = createBrowserHistory();

interface IProps {
  currentUser: IState['currentUser']['user'];
  dispatch: (action: any) => any;
  roles: IState['roles']['roles'];
}

class App extends React.Component<IProps> {
  public componentDidMount() {
    this.props.dispatch(fetchCurrentUser());
    this.props.dispatch(fetchRoles());
  }

  public render() {
    if (!this.props.currentUser || !this.props.roles) {
      // We need current user & roles loaded because of the authorization
      return <Loading />;
    }

    return (
      <Router history={history}>
        <div>
          <Header />
          <div className="container-fluid">
            <div className="row">
              <Sidebar />
              <div className="col">
                <FlashMessages />
                <Switch>
                  <Route path="/admin" exact component={Home} />

                  <Route path="/admin/sources" exact component={Sources} />
                  <Route path="/admin/sources/new" exact component={SourceNew} />
                  <Route path="/admin/sources/edit/:id" exact component={SourceEdit} />

                  <Route path="/admin/sources/:sourceId" exact component={SourceDetail} />
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

                  <Route path="/admin/statements/:id" exact component={StatementDetail} />

                  <Route path="/admin/bodies" exact component={Bodies} />
                  <Route path="/admin/bodies/new" exact component={BodyNew} />
                  <Route path="/admin/bodies/edit/:id" exact component={BodyEdit} />

                  <Route path="/admin/speakers" exact component={Speakers} />
                  <Route path="/admin/speakers/new" exact component={SpeakerNew} />
                  <Route path="/admin/speakers/edit/:id" exact component={SpeakerEdit} />

                  <Route path="/admin/users" exact component={Users} />
                  <Route path="/admin/users/new" exact component={UserNew} />
                  <Route path="/admin/users/edit/:id" exact component={UserEdit} />

                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
  roles: state.roles.roles,
});

export default connect(mapStateToProps)(App);
