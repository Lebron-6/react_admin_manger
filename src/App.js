// 应用的根组件

import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Admin from './pages/admin/admin.jsx'
import Login from './pages/login/login.jsx'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
        {/* 某个时间点只匹配一个路由 */}
      </BrowserRouter>
    )
  }
}