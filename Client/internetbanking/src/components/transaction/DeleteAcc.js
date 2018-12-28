import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { getAccountByIDQuery, deleteAccountMutation, getAccountsQuery } from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'

class PaymentAccs extends Component {

    state = {
        checkbalance: false,
        redirect: false
    }

    handleYes = () => {
        const { accountById } = this.props.data;
        if (accountById.balance > 0) {
            this.setState({ checkbalance: true });
        } else {
            console.log("Check");
            this.props.deleteAccountMutation({
                variables: {
                    id: this.props.id
                },
                refetchQueries: [{query: getAccountsQuery}]
            });
            this.setState({ redirect: true });
        }
    }

    handleNo = () => {
        this.setState({ redirect: true });
    }

    balanceMessege = () => {
        if (this.state.checkbalance === true)
            return (
                <div className="alert alert-dismissible fade show mb-3" role="alert">
                    You still have money in this account, click <Link to='/'>here</Link> to transfer your money
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
    }

    render() {
        const { accountById } = this.props.data;
        if (accountById) {
            const { auth } = this.props;
            if (this.state.redirect === true) return <Redirect to='/accounts' />;
            if (!auth.uid) return <Redirect to='/signin' />;
            return (
                <div className='container text-center mx-auto'>
                    <div className='row'>
                        <div className='col-md-8 mb-8 mx-auto'>
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Delete this account?</span>
                            </h4>
                            <ul className="list-group mb-3">
                                <li className="list-group-item d-flex justify-content-between lh-condensed">
                                    <div>
                                        <h6 className="my-0">Number: {accountById.number}</h6>
                                    </div>
                                    <span className="text-muted">Balance: ${accountById.balance}</span>
                                </li>
                            </ul>
                            {this.balanceMessege()}
                            <button className='btn btn-success col-md-6' onClick={this.handleYes}>Yes</button>
                            <button className='btn btn-danger col-md-6' onClick={this.handleNo}>No</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='container text-center mx-auto'>
                    <div className='row'>
                        <div className='col-md8 mb-8 mx-auto'>
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Loading accounts...</span>
                            </h4>
                        </div>
                    </div>
                </div>
            )
        }
    }

}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    return {
        auth: state.firebase.auth,
        id: id
    }
}

export default compose(
    connect(mapStateToProps),
    graphql(deleteAccountMutation, { name: 'deleteAccountMutation' }),
    graphql(getAccountsQuery, { name: 'getAccountsQuery' }),
    graphql(getAccountByIDQuery, {
        options: (props) => {
            return {
                variables: { id: props.id }
            }
        }
    })
)(PaymentAccs)