import React, { Component } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authAction'
import { Redirect } from 'react-router-dom'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    captcha: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.captcha && this.state.captcha !== 'error') {
      this.props.signIn({
        email: this.state.email,
        password: this.state.password
      });
    }
    else {
      this.setState({ captcha: 'error' });
    }
  }

  onChange = (value) => {
    this.setState({ captcha: value });
  }

  onExpired = () => {
    this.setState({ captcha: 'error' });
  }

  loginError = () => {
    if (this.props.authError === 'auth/user-not-found')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Incorrect username
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.props.authError === 'auth/wrong-password')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Incorrect password
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.state.captcha === 'error')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Please do the captcha
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
  }

  render() {
    const {auth} = this.props;
    if(auth.uid) return <Redirect to='/' />;
    return (
      <div className="container text-center">
        <form className="form-signin mx-auto col-md-4" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          {/* Email input */}
          <label htmlFor="email" className="sr-only">Email address</label>
          <input type="email" id="email" className="form-control" placeholder="Email address" required="" autoFocus onChange={this.handleChange} />
          {/* Password input */}
          <label htmlFor="password" className="sr-only">Password</label>
          <input type="password" id="password" className="form-control" placeholder="Password" required="" onChange={this.handleChange} />
          {/* reCaptcha */}
          <div className='mx-auto'>
            <ReCAPTCHA
              sitekey="6LeDuIQUAAAAAJNjHbC5jY8lEWMED-SL7TzIXOeO"
              onChange={this.onChange}
              onExpired={this.onExpired}
            />
            {this.loginError()}
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)