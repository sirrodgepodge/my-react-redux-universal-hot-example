import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as authActions from 'shared/redux/reducers/auth';


@connect(
    store => ({
      user: store.auth.user,
      addingPassword: store.auth.addingPassword,
      addingPasswordError: store.auth.addingPasswordError && store.auth.addingPasswordError.error
    }),
    authActions)
export default class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func,
    addPassword: PropTypes.func,
    addingPassword: PropTypes.bool,
    addingPasswordError: PropTypes.bool
  }

  handleSubmit = event => {
    event.preventDefault();
    const passwordInput = this.refs.password;
    this.props.addPassword({
      _id: this.props.user._id,
      password: passwordInput.value
    });
    passwordInput.value = '';
  }

  render() {
    const {
      user,
      logout,
      addingPassword,
      addingPasswordError
    } = this.props;

    return (user &&
      <div className='container'>
        <h1>Login Success</h1>

        <div>
          <p>Hi, {user.email}. You have just successfully logged in, and were forwarded here
            by <code>componentWillReceiveProps()</code> in <code>App.js</code>, which is listening to
            the auth reducer via redux <code>@connect</code>. How exciting!
          </p>

          <p>
            The same function will forward you to <code>/</code> should you chose to log out. The choice is yours...
          </p>

          <div>
            <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out'/>{' '}Log Out</button>
          </div>
          {
            !user.hasPassword
            &&
            <div>
              Add Password to account
              <form className='login-form form-inline' onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <input type='text' ref='password' placeholder='Password' type='password' className='form-control'/>
                  <button className='btn btn-success' onClick={this.handleSubmit}><i className='fa fa-pencil-square-o'/>{' '}Add Password</button>
                </div>
              </form>
            </div>
          }
          {
            !user.google
            &&
            <a className='btn btn-danger' href='/auth/google'>
              <i className='fa fa-google o-auth-btn'/>
              {' '} Connect Google Account
            </a>
          }
          {
            !user.facebook
            &&
            <a className='btn btn-primary' href='/auth/facebook'>
              <i className='fa fa-facebook o-auth-btn'/>
              {' '} Connect Facebook Account
            </a>
          }
          {
            addingPassword
            &&
              <i className='fa fa-cog fa-spin fa-4x'/>
            ||
            addingPasswordError
            &&
              <div className='alert alert-danger'>
                There was an error adding password: {addingPasswordError}
              </div>
          }
        </div>
      </div>
    );
  }
}
