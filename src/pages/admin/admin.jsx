
// 后台管理的路由组件

import React, { Component } from 'react'
import { Redirect, Switch, Route } from "react-router-dom"
import { Layout } from 'antd'
import { connect } from "react-redux"

// import memoryUtils from '../../utils/memoryUtils'
import LeftNav from "../../components/left-nav"
import Header from "../../components/header"

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
// import NotFound from '../not-found/not-found'
// import Order from '../order/order'

const { Footer, Sider, Content } = Layout

class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const user = this.props.user
        if (!user || !user._id) {
            return <Redirect to="/login" />
            // 如果未登录 则自动跳转到登录页面(在render中)
        }
        return (
            <Layout style={{ minHeight: "100%" }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ margin: "15px" }}>
                        <Switch>
                            <Redirect from='/' exact to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/user' component={User} />
                            <Route path='/role' component={Role} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route path="/charts/line" component={Line} />
                            {/* <Route path="/order" component={Order} /> */}
                            {/* <Route component={NotFound} /> */}
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center", color: "#ccc", backgroundColor: "#fff" }}>推荐使用谷歌浏览器,可以获得更佳的页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ user: state.user }), {}
)(Admin)