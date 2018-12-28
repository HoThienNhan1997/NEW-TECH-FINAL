import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAccountsQuery, updateAccountMutation, getUserQuery } from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import Select from 'react-select'

const accountoptions = [];

const initialState = {
    number: '',
    amount: '',
    accountId: '',
    selectedOption: null,
    error: null
}

class AddMoney extends Component {
    state = initialState;
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        var amount = parseFloat(this.state.amount);
        const { allAccounts } = this.props.getAccountsQuery;
        var account = allAccounts.nodes.find((account) => { return account.id === this.state.accountId });
        if(amount<=1000) this.setState({error:'Invalid amount'});
        else {
            this.setState({ error: 'Success' });
            this.props.updateAccountMutation({
                variables: {
                    balance: account.balance+amount,
                    id: account.id
                },
                refetchQueries: [{ query: getAccountsQuery }]
            });
            console.log(this.state.error);
            this.setState(initialState);
            this.setState({error:'Success'});
        }
    }

    createError = () => {
        if (this.state.error === 'Invalid amount')
            return (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Invalid amount
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        if (this.state.error === 'Success')
            return (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Successfully added money to account
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
    }

    componentWillMount() {
        accountoptions.splice(0,accountoptions.length)
        this.props.getAccountsQuery.refetch();
    }

    handleSelect = (selectedOption) => {
        this.setState({
            accountId: selectedOption.value,
            selectedOption
        });
    }

    render() {
        const { allAccounts } = this.props.getAccountsQuery;
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />;
        const { userById } = this.props.getUserQuery; 
        if(userById && userById.permission===1) return <Redirect to='/'/>
        if (allAccounts) {
            const accountList = allAccounts.nodes;
            console.log(accountList);
            if (accountoptions.length === 0) {
                for (var i = 0; i < accountList.length; i++) {
                    accountoptions.push({ value: accountList[i].id, label: accountList[i].number })
                }
            }
            return (
                <div className="container text-center">
                    <form className="form-signin mx-auto col-md-4" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Add money</h1>
                        
                        <label htmlFor="accountId" className="sr-only">Account number</label>
                        <Select value={this.state.selectedOption} onChange={this.handleSelect} options={accountoptions} placeholder='Account number' name='accountId' />
                        
                        <label htmlFor="amount" className="sr-only">Amount</label>
                        <input type="number" id="amount" className="form-control" placeholder="Amount" value={this.state.amount} required onChange={this.handleChange} />

                        {this.createError()}
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Add money</button>
                    </form>
                </div>
            )
        } else {
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
    graphql(getAccountsQuery, { name: 'getAccountsQuery' }),
    graphql(updateAccountMutation, { name: "updateAccountMutation" }),
    graphql(getUserQuery, {
        name: "getUserQuery",
        options: (props) => {
          return {
            variables: { id: props.auth.uid }
          }
        }
      })
)(AddMoney)