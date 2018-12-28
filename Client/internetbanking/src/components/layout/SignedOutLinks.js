import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item mr-sm-2">
            <NavLink to='./signin' className="nav-link" >Sign In</NavLink>
          </li>
        </ul>
  )
}

export default SignedOutLinks