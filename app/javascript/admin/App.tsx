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

                <Route path="/admin/bodies" exact component={Bodies} />
                <Route path="/admin/bodies/new" exact component={BodyNew} />
                <Route path="/admin/bodies/edit/:id" exact component={BodyEdit} />

                <Route path="/admin/speakers" exact component={Speakers} />
                <Route path="/admin/speakers/new" exact component={SpeakerNew} />
                <Route path="/admin/speakers/edit/:id" exact component={SpeakerEdit} />

                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
