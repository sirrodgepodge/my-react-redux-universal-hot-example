import React from 'react';
import {IndexRoute, Route} from 'react-router';
import authedRoute from './lib/authedRoute';
import {
    App,
    Chat,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
  } from './containers';

export default store => (
  <Route path='/' component={App}>
    { /* Home (main) route */ }
    <IndexRoute component={Home}/>

    { /* Routes requiring login */ }
    <Route onEnter={authedRoute(store)}>
      <Route path='chat' component={Chat}/>
      <Route path='loginSuccess' component={LoginSuccess}/>
    </Route>

    { /* Routes not requiring login */ }
    <Route path='about' component={About}/>
    <Route path='login' component={Login}/>
    <Route path='survey' component={Survey}/>
    <Route path='widgets' component={Widgets}/>

    { /* Catch all route */ }
    <Route path='*' component={NotFound} status={404} />
  </Route>
);
