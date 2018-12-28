import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import StaffLinks from './StaffLinks'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserQuery } from '../../queries/Queries'



const Navbar = (props) => {
  const { auth } = props
  const { userById } = props.getUserQuery;
  if (userById) {
    const { permission } = userById;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <Link to='/' className="navbar-brand">Internet banking</Link>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault"></div>
        <div className="float-right" id="navbarsExampleDefault">
          {auth.uid ? <SignedInLinks /> : <SignedOutLinks />}
          {permission === 2 && auth.uid ? <StaffLinks /> : null}
        </div>
      </nav>
    )
  }
  else return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <Link to='/' className="navbar-brand">Internet banking</Link>
    </nav>
  )
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(getUserQuery, {
    name: "getUserQuery",
    options: (props) => {
      return {
        variables: { id: props.auth.uid }
      }
    }
  })
)(Navbar)