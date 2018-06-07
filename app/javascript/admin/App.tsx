import * as React from 'react';
import { Route, Router, Switch } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';

import Bodies from './components/Bodies';
import BodyEdit from './components/BodyEdit';
import BodyNew from './components/BodyNew';
import FlashMessages from './components/FlashMessages';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Sidebar from './components/Sidebar';
import SpeakerEdit from './components/SpeakerEdit';
import SpeakerNew from './components/SpeakerNew';
import Speakers from './components/Speakers';
import Statements from './components/Statements';

import SourceEdit from './components/statements/SourceEdit';
import SourceNew from './components/statements/SourceNew';

import UserEdit from './components/UserEdit';
import UserNew from './components/UserNew';
import Users from './components/Users';

export default function App() {
  return (
    <Router history={createBrowserHistory()}>
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <div className="col">
              <FlashMessages />
              <Switch>
                <Route path="/admin" exact component={Home} />

                <Route path="/admin/statements" exact component={Statements} />
                <Route path="/admin/statements/sources/new" exact component={SourceNew} />
                <Route path="/admin/statements/sources/edit/:id" exact component={SourceEdit} />

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
