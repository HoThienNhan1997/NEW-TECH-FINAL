import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authAction'

const SignedInLinks = (props) => {
  return (
        <ul className="navbar-nav mr-auto float-right">
          <li className="nav-item">
            <NavLink to='/accounts' className="nav-link" >Payment accounts</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/receivers' className="nav-link" >Receivers</NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={props.signOut}>LogOut</a>
          </li>
        </ul>
  )
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    signOut: () => dispatch(signOut())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignedInLinks)