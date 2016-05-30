import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { LinkContainer } from 'react-router-bootstrap';
import Helmet from 'react-helmet';
import config from 'config'; // eslint-disable-line import/default

// used to create actions to bind functions to API call responses
import { bindToErrorAction, unbindFromErrorAction } from 'simple-iso-fetch';

// using react-toastr library to demo simple-iso-fetch bindings
import {
  ToastContainer,
  ToastMessage,
} from 'react-toastr';
const ToastMessageAnim = ToastMessage.animation;


// redux interaction
import { isLoaded as isInfoLoaded, load as loadInfo } from 'shared/redux/reducers/info';
import { logout } from 'shared/redux/reducers/auth';

// bootstrap
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

// components
import InfoBar from 'shared/common/components/r_InfoBar';


@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    const state = getState();

    if (!isInfoLoaded(state))
      promises.push(dispatch(loadInfo()));

    // if (!isAuthLoaded(state))
    //   promises.push(dispatch(loadAuth()));

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, push, bindToErrorAction, unbindFromErrorAction})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    bindToErrorAction: PropTypes.func.isRequired,
    unbindFromErrorAction: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.errorToastFunc = (res) => {
      (res.body.errors || [{errorMessage: res.body}]).forEach(error =>
        this.refs.container.error(
          process.env.NODE_ENV === 'production' ?
          'Sorry! ...please refresh the page' :
          `${error.errorCode || 500}: ${error.errorMessage && error.errorMessage.error || error.errorMessage} \n ${res.method},${res.url}`,
          `${res.body && res.body.status || res.status || 500} (internal)` || 'There was a server-side error',
          {closeButton: true}
        ));
    };

    // transform response
    this.props.bindToErrorAction(this.errorToastFunc);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.push('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.push('/');
    }
  }

  componentWillUnmount() {
    this.props.unbindFromErrorAction(this.errorToastFunc);
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;
    const styles = require('shared/app.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <div>
          <ToastContainer
            toastMessageFactory={props =>
              <ToastMessageAnim {...props}
                className='slide'
                transition='slide'
                timeOut={6000}/>}
                ref='container'
                className='toast-top-right'/>
        </div>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to='/' activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>
                  {config.app.title}
                </span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              {
                user &&
                <LinkContainer to='/chat'>
                  <NavItem eventKey={1}>Chat</NavItem>
                </LinkContainer>
              }
              <LinkContainer to='/widgets'>
                <NavItem eventKey={2}>Widgets</NavItem>
              </LinkContainer>
              <LinkContainer to='/survey'>
                <NavItem eventKey={3}>Survey</NavItem>
              </LinkContainer>
              <LinkContainer to='/about'>
                <NavItem eventKey={4}>About Us</NavItem>
              </LinkContainer>

              {
                !user &&
                <LinkContainer to='/login'>
                  <NavItem eventKey={5}>Login</NavItem>
                </LinkContainer>
              }
              {
                user &&
                <LinkContainer to='/logout'>
                  <NavItem eventKey={6} className='logout-link' onClick={this.handleLogout}>
                    Logout
                  </NavItem>
                </LinkContainer>
              }
              {
                user &&
                <LinkContainer to='/loginSuccess'>
                  <NavItem eventKey={6}>
                    Logged in as <strong>{user.email}</strong>.
                  </NavItem>
                </LinkContainer>
              }
            </Nav>
            <Nav navbar pullRight>
              <li className={`nav ${styles.userPhoto} ${user && user.google && user.google.photo && 'show'}`}
                style={user && user.google && user.google.photo && {backgroundImage: `url(${user.google.photo})`}}/>
              <li className={`nav ${styles.userPhoto} ${user && user.facebook && user.facebook.photo && 'show'}`}
                style={user && user.facebook && user.facebook.photo && {backgroundImage: `url(${user.facebook.photo})`}}/>
              <NavItem eventKey={1} target='_blank' title='View on Github' href='https://github.com/erikras/react-redux-universal-hot-example'>
                <i className='fa fa-github'/>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar/>

        <div className='well text-center'>
          Have questions? Ask for help <a
          href='https://github.com/erikras/react-redux-universal-hot-example/issues'
          target='_blank'>on Github</a> or in the <a
          href='https://discord.gg/0ZcbPKXt5bZZb1Ko' target='_blank'>#react-redux-universal</a> Discord channel.
        </div>
      </div>
    );
  }
}
