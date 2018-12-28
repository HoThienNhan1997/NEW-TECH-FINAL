import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { getUserQuery } from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'

class PaymentAccs extends Component {

    componentWillMount(){
        this.props.data.refetch();
    }
    componentDidMount(){
        this.props.data.refetch();
    }

    render() {
        const { userById } = this.props.data;
        if (userById) {
            const { accountsByUserid } = userById
            console.log(accountsByUserid);
            const { auth } = this.props;
            if (!auth.uid) return <Redirect to='/signin' />;
            return (
                <div className='container text-center mx-auto'>
                    <div className='row'>
                        <div className='col-md-8 mb-8 mx-auto'>
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Payment accounts</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {accountsByUserid.nodes.map((account) => {
                                    return (
                                        <Link to={'/delete/' + account.id}>
                                            <li className="list-group-item d-flex justify-content-between lh-condensed" key={account.id}>
                                                <div>
                                                    <h6 className="my-0">Number: {account.number}</h6>
                                                </div>
                                                <span className="text-muted">Balance: {account.balance}</span>
                                            </li>
                                        </Link>
                                    )
                                })}
                            </ul>
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

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps),
    graphql(getUserQuery, {
        options: (props) => {
            return {
                variables: { id: props.auth.uid }
            }
        }
    })
)(PaymentAccs)