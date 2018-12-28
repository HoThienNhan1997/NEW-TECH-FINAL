import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class History extends Component {


    render() {
        const { userById } = this.props.getUserQuery;
        if (userById) {
            const { transactionsBySenderid } = userById
            return (
                <div className='col-md-4 order-md-2 mb-4'>
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <Link to='/transhistory'  className="text-muted"><span className="text-muted">Transaction history</span></Link>
                    </h4>
                    <ul className="list-group mb-3">
                        {transactionsBySenderid.nodes.map((transaction) => {
                            return (
                                <li className="list-group-item d-flex justify-content-between lh-condensed" key={transaction.id}>
                                    <div className='text-danger'>
                                        <h6 className="my-0">With: {transaction.recnumber}</h6>
                                        <small className="text-muted">{transaction.date}</small>
                                    </div>
                                    <span className="text-danger">-{transaction.amount}</span>
                                </li>
                            )
                        })}
                    </ul>
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
    connect(mapStateToProps)
)(History)