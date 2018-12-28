import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserListQuery, getAccountsQuery, addAccountMutation, getUserQuery } from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import Select from 'react-select'

const useroptions = [];
const bankoptions = [
    { value: 'Agribank', label: 'Agribank' },
    { value: 'ACB', label: 'ACB' },
    { value: 'Techcombank', label: 'Techcombank' },
    { value: 'SeABank', label: 'SeABank' },
    { value: 'VPBank', label: 'VPBank' },
    { value: 'HDBank', label: 'HDBank' },
    { value: 'VietinBank', label: 'VietinBank' },
    { value: 'BIDV', label: 'BIDV' }
]

const initialState = {
    number: '',
    bank: '',
    userId: '',
    balance: 0,
    selectedOption: null,
    selectedBank: null,
    error: null
}

class CreateAcc extends Component {
    state = initialState;
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit state:", this.state);
        var flag = true;
        var length = this.state.number.toString();
        const { allAccounts } = this.props.getAccountsQuery;
        for (var i = 0; i < allAccounts.nodes.length; i++) {
            if (allAccounts.nodes[i].number === this.state.number) flag = false;
        }
        if (length < 8 || this.state.number < 0) this.setState({ error: 'Invalid number' });
        else if (flag === false) {
            this.setState({ error: 'Number already in use' });
        }
        else if (flag === true) {
            this.props.addAccountMutation({
                variables: {
                    number: this.state.number,
                    userId: this.state.userId,
                    bank: this.state.bank
                },
                refetchQueries: [{ query: getAccountsQuery }]
            });
            this.setState(initialState);
            this.setState({ error: 'Success' });
        }
    }

    createError = () => {
        if (this.state.error === 'Number already in use')
            return (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    Account already in use
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        if (this.state.error === 'Success')
            return (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Account created successfully
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        if (this.state.error === 'Invalid number')
            return (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Invalid number
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
    }



    handleUserSelect = (selectedOption) => {
        this.setState({
            userId: selectedOption.value,
            selectedOption
        });
    }
    handleBankSelect = (selectedBank) => {
        this.setState({
            bank: selectedBank.value,
            selectedBank
        });
    }

    render() {
        const { allUsers } = this.props.getUserListQuery;
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />;
        const { userById } = this.props.getUserQuery; 
        if(userById && userById.permission===1) return <Redirect to='/'/>
        if (allUsers) {
            const userList = allUsers.nodes;
            if (useroptions.length === 0) {
                for (var i = 0; i < userList.length; i++) {
                    useroptions.push({ value: userList[i].id, label: userList[i].email })
                }
            }
            return (
                <div className="container text-center">
                    <form className="form-signin mx-auto col-md-4" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Create new account</h1>
                        {/* Email input */}
                        <label htmlFor="userId" className="sr-only">User email</label>
                        <Select value={this.state.selectedOption} onChange={this.handleUserSelect} options={useroptions} placeholder='User email' name='userId' />
                        {/* Password input */}
                        <label htmlFor="bank" className="sr-only">Bank</label>
                        <Select value={this.state.selectedBank} onChange={this.handleBankSelect} options={bankoptions} placeholder='Bank' name='bank' />
                        {/* reCaptcha */}
                        <label htmlFor="name" className="sr-only">Number</label>
                        <input type="number" id="number" className="form-control" placeholder="Number" value={this.state.number} required onChange={this.handleChange} />

                        {this.createError()}
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Create account</button>
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
    graphql(getUserListQuery, { name: "getUserListQuery" }),
    graphql(addAccountMutation, { name: "addAccountMutation" }),
    graphql(getUserQuery, {
        name: "getUserQuery",
        options: (props) => {
          return {
            variables: { id: props.auth.uid }
          }
        }
      })
)(CreateAcc)