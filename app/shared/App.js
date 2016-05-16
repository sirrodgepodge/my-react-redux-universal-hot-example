import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { LinkContainer } from 'react-router-bootstrap';
import Helmet from 'react-helmet';
import config from 'config'; // eslint-disable-line import/default

// redux interaction
import { isLoaded as isInfoLoaded, load as loadInfo } from 'shared/redux/reducers/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'shared/redux/reducers/auth';

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

    if (!isAuthLoaded(state))
      promises.push(dispatch(loadAuth()));

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.push('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.push('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    const styles = require('shared/app.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
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
            </Nav>
            {
              user &&
              <p className={`${styles.loggedInMessage} navbar-text`}>
                Logged in as <strong>{user.name}</strong>.
              </p>
            }
            <Nav navbar pullRight>
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
