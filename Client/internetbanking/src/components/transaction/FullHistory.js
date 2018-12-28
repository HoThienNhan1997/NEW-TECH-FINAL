import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { getUserQuery } from '../../queries/Queries'
import { Redirect } from 'react-router-dom'

class FullHistory extends Component {

    componentDidMount(){
        this.props.getUserQuery.refetch();
    }

    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />;
        const { userById } = this.props.getUserQuery;
        if (userById) {
            const { transactionsBySenderid, transactionsByRecid } = userById
            return (

                <div className='container'>
                    <div className="row">
                        <div className='col-md-12 mb-12 text-center'>
                            <h2 className='mx-auto'>Transaction history</h2>
                        </div>

                        <div className='col-md-6 order-md-2 mb-6'>
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Sent</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {transactionsBySenderid.nodes.map((transaction) => {
                                    return (
                                        <li className="list-group-item d-flex justify-content-between lh-condensed" key={transaction.id}>
                                            <div className='text-danger'>
                                                <h6 className="my-0">To: {transaction.recnumber}</h6>
                                                <div>Note: {transaction.note}</div>
                                                <small className="text-muted">{transaction.date}</small>
                                            </div>
                                            <span className="text-danger">-{transaction.amount}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className='col-md-6 order-md-1 mb-6'>
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Received</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {transactionsByRecid.nodes.map((transaction) => {
                                    return (
                                        <li className="list-group-item d-flex justify-content-between lh-condensed" key={transaction.id}>
                                            <div className='text-success'>
                                                <h6 className="my-0">From: {transaction.sendernumber}</h6>
                                                <div>Note: {transaction.note}</div>
                                                <small className="text-muted">{transaction.date}</small>
                                            </div>
                                            <span className="text-success">+{transaction.amount}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='col-md-8 order-md-1'>
                    <h4 className="mb-3">Loading data...</h4>
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
        name: "getUserQuery",
        options: (props) => {
            return {
                variables: { id: props.auth.uid }
            }
        }
    })
)(FullHistory)