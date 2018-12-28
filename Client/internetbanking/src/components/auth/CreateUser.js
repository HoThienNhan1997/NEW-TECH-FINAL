import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUp } from '../../store/actions/authAction'
import {addUserMutation, getUserQuery} from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'
import { Redirect } from 'react-router-dom'

const initialState={
    email: '',
    password: '',
    name:'',
    phone:'',
    permission: 1
}

class SignIn extends Component {
  state = initialState;
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signUp(this.state);
  }

  createError = () => {
    if (this.props.signupinfo.authError === 'auth/email-already-in-use')
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Email already in use
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
      if (this.props.signupinfo.authError === 'Success')
      return (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          User created successfully
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
  }

  componentWillUpdate = (props) =>{
    if(props.signupinfo!==this.props.signupinfo) {
        this.setState(initialState);
      console.log(props);
        this.props.addUserMutation({
            variables:{
                name:props.signupinfo.name,
                email:props.signupinfo.email,
                phone:props.signupinfo.phone,
                id:props.signupinfo.uid
            }
        })
    }
  }

  render() {
      console.log(this.props.signupinfo);
      const { auth } = this.props;
      if (!auth.uid) return <Redirect to='/signin' />;
    const { userById } = this.props.getUserQuery; 
    if(userById && userById.permission===1) return <Redirect to='/'/>
    return (
      <div className="container text-center">
        <form className="form-signin mx-auto col-md-4" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Create new user</h1>
          {/* Email input */}
          <label htmlFor="email" className="sr-only">Email address</label>
          <input type="email" id="email" className="form-control" placeholder="Email address" value={this.state.email} required autoFocus onChange={this.handleChange} />
          {/* Password input */}
          <label htmlFor="password" className="sr-only">Password</label>
          <input type="password" id="password" className="form-control" placeholder="Password" value={this.state.password} required onChange={this.handleChange} />
          {/* reCaptcha */}
          <label htmlFor="name" className="sr-only">Full name</label>
          <input type="text" id="name" className="form-control" placeholder="Full name" value={this.state.name} required onChange={this.handleChange} />

          <label htmlFor="phone" className="sr-only">Phone number</label>
          <input type="text" id="phone" className="form-control" placeholder="Phone number" value={this.state.phone} required onChange={this.handleChange} />
          {this.createError()}
          <button className="btn btn-lg btn-primary btn-block" type="submit">Create account</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    signupinfo: state.auth,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (creds) => dispatch(signUp(creds))
  }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(addUserMutation, { name: "addUserMutation" }),
    graphql(getUserQuery, {
        name: "getUserQuery",
        options: (props) => {
          return {
            variables: { id: props.auth.uid }
          }
        }
      })
)(SignIn)