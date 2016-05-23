import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'shared/redux/reducers/auth';

// utility
import cx from 'classnames';


@connect(
  store => ({
    user: store.auth.user,
    loggingIn: store.auth.loggingIn,
    loginError: store.auth.loginError && store.auth.loginError.error
  }),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    loggingIn: PropTypes.bool,
    loginError: PropTypes.string,
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
    const emailInput = this.refs.email;
    const passwordInput = this.refs.password;
    this.props[authType]({
      email: emailInput.value,
      password: passwordInput.value
    });
    emailInput.value = '';
    passwordInput.value = '';
  }

  render() {
    // retrieve vars from props and state
    const {
      user,
      loggingIn,
      logout,
      loginError
    } = this.props;
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
                <form className='login-form form-inline' onSubmit={this.handleSubmit.bind(this, 'signup')}>
                  <div className='form-group'>
                    <input type='text' ref='email' placeholder='Email' className='form-control'/>
                    <input type='text' ref='password' placeholder='Password' className='form-control'/>
                    <button className='btn btn-success' onClick={this.handleSubmit.bind(this, 'signup')}><i className='fa fa-pencil-square-o'/>{' '}Sign Up</button>
                  </div>
                </form>
                <p>This will sign you up as a user, storing the username and password in the mongoDB.</p>
              </div>
              ||
              <div>
                <form className='login-form form-inline' onSubmit={this.handleSubmit.bind(this, 'login')}>
                  <div className='form-group'>
                    <input type='text' ref='email' placeholder='Email' type='email' className='form-control'/>
                    <input type='text' ref='password' placeholder='Password' type='password' className='form-control'/>
                    <button className='btn btn-success' onClick={this.handleSubmit.bind(this, 'login')}><i className='fa fa-sign-in'/>{' '}Log In</button>
                  </div>
                </form>
                <p>This will log you in, verifying your username and password and retrieving you from mongoDB.</p>
              </div>
            )
        }
        {
          user &&
          <div>
            <p>You are currently logged in as {user.email}.</p>
            <div>
              <button className='btn btn-danger' onClick={logout}><i className='fa fa-sign-out'/>{' '}Log Out</button>
            </div>
          </div>
        }
        {
          (!user || !user.google)
          &&
          <a className='btn btn-danger' href='/auth/google'>
            <i className='fa fa-google o-auth-btn'/>
            {' '}Login/Signup
          </a>
        }
        {
          (!user || !user.facebook)
          &&
          <a className='btn btn-primary' href='/auth/facebook'>
            <i className='fa fa-facebook o-auth-btn'/>
            {' '}Login/Signup
          </a>
        }
        {
          loggingIn
          &&
            <i className='fa fa-cog fa-spin fa-4x'/>
          ||
          loginError
          &&
            <div className='alert alert-danger'>
              There was an auth error: {loginError}
            </div>
        }
      </div>
    );
  }
}

//
// // Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
// import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
//
// import * as actionCreators from '../../redux/actionCreators';
//
// class NavAuth extends Component {
//
//   constructor(){
//     super();
//   }
//
//   handleLocalAuth() {
//     const email = this.refs.email && this.refs.email.value;
//     const password = this.refs.password && this.refs.password.value;
//     this.props.dispatch(
//       actionCreators.localAuthRequest(email, password)
//     );
//   }
//
//   logout() {
//     this.props.dispatch(
//       actionCreators.logoutRequest()
//     );
//   }
//
//   render() {
//     const user = this.props.user;
//
//     return (
//       <ul className="nav navbar-nav navbar-right">
//         <li className={`nav user-photo ${user && user.google && user.google.photo && 'show'}`}
//             style={user && user.google && user.google.photo && {backgroundImage: `url(${user.google.photo})`}}/>
//         <li className={`nav user-photo ${user && user.facebook && user.facebook.photo && 'show'}`}
//             style={user && user.facebook && user.facebook.photo && {backgroundImage: `url(${user.facebook.photo})`}}></li>
//         <li className="nav-button">
//           {
//             (!user || !user.email || !user.hasPassword || !user.google || !user.google.photo || !user.facebook || !user.facebook.photo)
//             &&
//             <span>
//               LOG IN &#10161;
//               {
//                 (!user || !user.google)
//                 &&
//                 <a href="/auth/google"><i className="fa fa-google o-auth-btn"></i></a>
//               }
//               {
//                 (!user || !user.facebook)
//                 &&
//                 <a href="/auth/facebook"><i className="fa fa-facebook o-auth-btn"></i></a>
//               }
//               {
//                 (!user || !user.email)
//                 &&
//                 <input className="nav-input" ref="email" placeholder="email" type="text"/>
//               }
//               {/*Repeating logic the the two below because of some CSS annoying-ness*/}
//               {
//                 (!user || !user.hasPassword)
//                 &&
//                 <input className="nav-input" ref="password" placeholder="password" type="password"/>
//               }
//               {
//                 (!user || !user.hasPassword)
//                 &&
//                 <button className="local-auth-button" onClick={this.handleLocalAuth.bind(this)}>Post LocalAuth</button>
//               }
//             </span>
//           }
//           {
//             user
//             &&
//             <a className="nav-button log-out-button show" href="#" onClick={this.logout.bind(this)}>
//               LOG OUT
//             </a>
//           }
//         </li>
//       </ul>
//     );
//   }
// }
//
// function mapStateToProps(store) {
//   return {
//     user: store.user,
//   };
// }
//
// NavAuth.propTypes = {
//   user: PropTypes.shape({
//     email: PropTypes.string.isRequired,
//     createdDate: PropTypes.string.isRequired,
//     hasPassword: PropTypes.bool.isRequired,
//     google: PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       photo: PropTypes.string.isRequired,
//       link: PropTypes.string.isRequired
//     }),
//     facebook: PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       photo: PropTypes.string.isRequired,
//       link: PropTypes.string.isRequired
//     })
//   }),
//   dispatch: PropTypes.func.isRequired
// };
//
// export default connect(mapStateToProps)(NavAuth);
