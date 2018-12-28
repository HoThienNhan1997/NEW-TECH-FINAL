import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { getUserQuery } from '../../queries/Queries'
import { Redirect } from 'react-router-dom'

class ReceiverList extends Component {

    componentDidMount(){
        this.props.getUserQuery.refetch();
    }

    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />;
        const { userById } = this.props.getUserQuery;
        if (userById) {
            const { transactionsBySenderid } = userById
            return (

                <div className='container text-center mx-auto'>
                    <div className="row">
                        <div className='col-md-12 mb-12 text-center'>
                            <h2 className='mx-auto'>Receiver list</h2>
                        </div>

                        <div className='col-md-8 mx-auto mb-8'>
                            <ul className="list-group mb-3">
                                {transactionsBySenderid.nodes.map((transaction) => {
                                    return (
                                        <li className="list-group-item d-flex justify-content-between lh-condensed" key={transaction.id}>
                                            <div className='text'>
                                                <h6 className="my-0">Name: {transaction.userByRecid.name}</h6>
                                            </div>
                                            <span className="text">Number: {transaction.recnumber}</span>
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
)(ReceiverList)