import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

const SignedInLinks = (props) => {
  return (
        <ul className="navbar-nav mr-auto float-right">
          <li className="nav-item">
            <NavLink to='/createuser' className="nav-link" >Create user</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/createacc' className="nav-link" >Create payment account</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/addmoney' className="nav-link" >Add money</NavLink>
          </li>
        </ul>
  )
}

const mapStateToProps = (state) => {
  return{
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(SignedInLinks)