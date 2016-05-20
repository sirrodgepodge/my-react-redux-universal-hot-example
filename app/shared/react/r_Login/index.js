import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'shared/redux/reducers/auth';

// utility
import cx from 'classnames';


@connect(
  store => ({
    user: store.auth.user
  }),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  state = {
    showSignUp: false
  }

  toggleToState(isSignUp) {
    if(this.state.showSignUp !== isSignUp)
      this.setState({
        showSignUp: isSignUp
      });
  }

  handleSubmit = (authType, event) => {
    event.preventDefault();
    const usernameInput = this.refs.username;
    const passwordInput = this.refs.password;
    this.props[authType]({
      username: usernameInput.value,
      password: passwordInput.value
    });
    usernameInput.value = '';
    passwordInput.value = '';
  }

  render() {
    // retrieve vars from props and state
    const {user, logout} = this.props;
    const {showSignUp} = this.state;

    // styles
    const styles = require('./style.scss');

    return (
      <div className={`${styles.loginPage} container`}>
        <Helmet title={'Login'}/>
        <div>
          <div className={cx('h1', styles.toggleSignUp, {[styles.active]: !showSignUp})} onClick={this.toggleToState.bind(this, false)}><i className='fa fa-sign-in'/>
            {' '}Log In
          </div>
          <div className={cx('h1', styles.toggleSignUp, {[styles.active]: showSignUp})} onClick={this.toggleToState.bind(this, true)}><i className='fa fa-pencil-square-o'/>
            {' '}Sign Up
          </div>
        </div>
        {
          !user
          &&
            (
              showSignUp
              &&
              <div>
                <form className='login-form form-inline' onSubmit={this.handleSubmit}>
                  <div className='form-group'>
                    <input type='text' ref='username' placeholder='Username' className='form-control'/>
                    <input type='text' ref='password' placeholder='Password' className='form-control'/>
                    <button className='btn btn-success' onClick={this.handleSubmit.bind(this, 'signup')}><i className='fa fa-pencil-square-o'/>{' '}Sign Up</button>
                  </div>
                </form>
                <p>This will sign you up as a user, storing the username and password in the mongoDB.</p>
              </div>
              ||
              <div>
                <form className='login-form form-inline' onSubmit={this.handleSubmit}>
                  <div className='form-group'>
                    <input type='text' ref='username' placeholder='Username' className='form-control'/>
                    <input type='text' ref='password' placeholder='Password' className='form-control'/>
                    <button className='btn btn-success' onClick={this.handleSubmit.bind(this, 'login')}><i className='fa fa-sign-in'/>{' '}Log In</button>
                  </div>
                </form>
                <p>This will log you in, verifying your username and password and retrieving you from mongoDB.</p>
              </div>
            )
          ||
          <div>
            <form className='login-form form-inline' onSubmit={this.handleSubmit}>
              <div className='form-group'>
                <input type='text' ref='username' placeholder='Username' className='form-control'/>
                <input type='text' ref='password' placeholder='Password' className='form-control'/>
                <button className='btn btn-success' onClick={this.handleSubmit}><i className='fa fa-sign-in'/>{' '}Log In</button>
              </div>
            </form>
            <p>This will 'log you in' as this user, storing the username in the session of the API server.</p>
          </div>
        }
        {
          user &&
          <div>
            <p>You are currently logged in as {user.name}.</p>

            <div>
              <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out'/>{' '}Log Out</button>
            </div>
          </div>
        }
      </div>
    );
  }
}
