import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboard/Dashboard'
import SignIn from './components/auth/SignIn'
import PaymentAccs from './components/transaction/PaymentAccs'
import FullHistory from './components/transaction/FullHistory'
import DeleteAcc from './components/transaction/DeleteAcc'
import CreateUser from './components/auth/CreateUser'
import CreateAcc from './components/transaction/CreateAcc'
import AddMoney from './components/transaction/AddMoney'
import ReceiverList from './components/transaction/ReceiverList'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Dashboard}></Route>
            <Route path='/signin' component={SignIn}></Route>
            <Route path='/accounts' component={PaymentAccs}></Route>
            <Route path='/transhistory' component={FullHistory}></Route>
            <Route path='/delete/:id' component={DeleteAcc}></Route>
            <Route path='/createuser' component={CreateUser}></Route>
            <Route path='/createacc' component={CreateAcc}></Route>
            <Route path='/addmoney' component={AddMoney}></Route>
            <Route path='/receivers' component={ReceiverList}></Route>            
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
