import React, { Component } from 'react'
import History from './History'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getUserQuery, getAccountsQuery, addTransactionMutation, updateAccountMutation } from '../../queries/Queries'
import { graphql, compose } from 'react-apollo'
import axios from 'axios'

const initialState = {
  accnumber: '',
  recacc: '',
  amount: '',
  note: '',
  method: '',
  error: null,
  date: '',
  verification: '',
  verificationinput: '',
  verificationerr: '',
  success: '',
  sent: false
}

class Dashboard extends Component {


  componentWillMount() {
    this.props.getUserQuery.refetch();
  }

  state = initialState

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
    console.log(this.state.recacc);
    var today = new Date(),
      day = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    this.setState({ date: day });
  }

  makeTransaction = () => {
    const { userById } = this.props.getUserQuery;
    const { accountsByUserid } = userById
    const { allAccounts } = this.props.getAccountsQuery;
    const { auth } = this.props;
    var amount = parseFloat(this.state.amount);
    var senderaccount = accountsByUserid.nodes.find((account) => { return account.number === this.state.accnumber });
    var recaccount = allAccounts.nodes.find((account) => { return account.number === this.state.recacc });
    var senderbalance, recbalance;
    if (this.state.method === "sender") {
      senderbalance = senderaccount.balance - amount - 5000;
      recbalance = recaccount.balance + amount;
    }
    else {
      senderbalance = senderaccount.balance - amount;
      recbalance = recaccount.balance + amount - 5000;
    }
    this.props.addTransactionMutation({
      variables: {
        senderid: auth.uid,
        senderaccid: senderaccount.id,
        recid: recaccount.userid,
        recaccid: recaccount.id,
        amount: amount,
        note: this.state.note,
        sendernumber: senderaccount.number,
        recnumber: recaccount.number,
        date: this.state.date
      },
      refetchQueries: [{ query: getUserQuery, getAccountsQuery, variables: { id: auth.uid } }]
    });

    this.props.updateAccountMutation({
      variables: {
        balance: senderbalance,
        id: senderaccount.id
      }
    });

    this.props.updateAccountMutation({
      variables: {
        balance: recbalance,
        id: recaccount.id
      }
    });
    this.forceUpdate();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { userById } = this.props.getUserQuery;
    const { accountsByUserid } = userById
    const { allAccounts } = this.props.getAccountsQuery;
    var amount = parseFloat(this.state.amount);
    var balancecheck = true;
    console.log(this.state.amount);
    var flag = false;
    for (var i = 0; i < allAccounts.nodes.length; i++) {
      if (allAccounts.nodes[i].number === this.state.recacc) flag = true;
    }
    if (flag === true) {
      var senderaccount = accountsByUserid.nodes.find((account) => { return account.number === this.state.accnumber });

      if (senderaccount.balance < this.state.amount) {
        balancecheck = false;
      }
    }
    if (balancecheck === false) this.setState({ error: "Insufficient balance" });
    else if (this.state.accnumber === this.state.recacc) this.setState({ error: 'Transaction to self' });
    else if (flag === false) this.setState({ error: "Number doesn't exist" });
    else if (amount < 100000) this.setState({ error: "Transaction amount too low" });
    else {
      console.log(userById.email);
      var vericode = this.randomString();
      this.setState({ verification: vericode });
      setTimeout(() => {

        axios.post('http://localhost:6969/send', {
          recemail: userById.email,
          code: this.state.verification
        }).then((res) => {
          this.setState({ sent: true });
          console.log("Email sent");
        }).catch((err) => {
          console.log(err);
        })
      }, 3000);
    }
    console.log(this.state);
  }

  randomString = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  handleError = () => {
    if (this.state.error === 'Transaction to self')
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          Can't make transaction to same account
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.state.error === 'Insufficient balance')
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          Insufficient balance
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.state.error === "Number doesn't exist")
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          Can't find receiver account
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.state.error === "Transaction amount too low")
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          Transaction amount too low
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    if (this.state.success === "Success") {
      return (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          Transaction successful
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
    else return null;
  }

  handleVerificationError = () => {
    if (this.state.verificationerr === "Wrong verification code")
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          Wrong verification code
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
  }

  handleVerification = (e) => {
    e.preventDefault();
    console.log(this.state.verification);
    if (this.state.verification !== this.state.verificationinput) {
      this.setState({ verificationerr: "Wrong verification code" });
    } else {
      this.setState({ verificationerr: "Correct" });
      this.makeTransaction();
      this.setState(initialState);
      this.setState({ success: 'Success' });
    }
  }

  render() {
    const { userById } = this.props.getUserQuery;
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />;
    if (userById) {
      const { accountsByUserid } = userById
      if (this.state.sent === false) {
        return (
          <div className='container'>
            <div className="row">

              <History getUserQuery={this.props.getUserQuery} />
              <div className='col-md-8 order-md-1'>
                <h4 className="mb-3">New transaction</h4>
                <form className='need-validation' onSubmit={this.handleSubmit}>

                  <div className="mb-3">
                    <label htmlFor="accnumber">Account number</label>
                    <select className="custom-select d-block w-100" id="accnumber" onChange={this.handleChange} required>
                      <option value='' selected disabled>Choose...</option>
                      {/* Map accounts */}
                      {accountsByUserid.nodes.map((account) => {
                        return (<option value={account.number} key={account.id}>{account.number}</option>)
                      })}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="recacc">Receiver account number</label>
                    <input type="number" className="form-control" id="recacc" placeholder="" onChange={this.handleChange} value={this.state.recacc} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="amount">Transaction amount</label>
                    <input type="number" className="form-control" id="amount" placeholder="" onChange={this.handleChange} value={this.state.number} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="note">Note</label>
                    <textarea className="form-control" id="note" placeholder="" onChange={this.handleChange} value={this.state.note} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="method">Payment method</label>
                    <select className="custom-select d-block w-100" id="method" onChange={this.handleChange} required>
                      <option value='' selected disabled>Choose...</option>
                      <option value='sender'>Sender</option>
                      <option value='receiver'>Receiver</option>
                    </select>
                  </div>
                  {this.handleError()}
                  <button className="btn btn-primary btn-lg btn-block" type="submit">Send email</button>
                </form>
              </div>
            </div>
          </div>
        )
      }
      else return (
        <div className='container'>
          <div className="row">
            <History getUserQuery={this.props.getUserQuery} />
            <div className='col-md-8 order-md-1'>
              <h4 className="mb-3">Verification</h4>
              <form className='need-validation' onSubmit={this.handleVerification}>

                <div className="mb-3">
                  <label htmlFor="verificationinput">Verification code</label>
                  <input type="text" className="form-control" id="verificationinput" onChange={this.handleChange} value={this.state.verificationinput} required />
                </div>
                {this.handleVerificationError()}
                <button className="btn btn-primary btn-lg btn-block" type="submit">Make transaction</button>
              </form>
            </div>
          </div>
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
  graphql(addTransactionMutation, { name: "addTransactionMutation" }),
  graphql(updateAccountMutation, { name: "updateAccountMutation" }),
  graphql(getAccountsQuery, { name: "getAccountsQuery" }),
  graphql(getUserQuery, {
    name: "getUserQuery",
    options: (props) => {
      return {
        variables: { id: props.auth.uid }
      }
    }
  })
)(Dashboard)