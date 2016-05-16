import React from 'react';
import {IndexRoute, Route} from 'react-router';

// utility function
import authedRoute from './lib/authedRoute';

// components
import App from './App';
import Chat from './react/r_Chat';
import Home from './react/f_Home';
import Widgets from './react/r_Widgets';
import About from './react/c_About';
import Login from './react/r_Login';
import LoginSuccess from './react/r_LoginSuccess';
import Survey from './react/r_Survey';
import NotFound from './react/f_NotFound';


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
