import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom"
// withRouter 可以得到非路由组件的 math location history 三个属性
import { Menu, Icon } from 'antd'
import { connect } from "react-redux"

import { setHeadTitle } from "../../redux/actions"

import "./index.less"
import menuList from "../../config//menuConfig"


const { SubMenu } = Menu

class LeftNav extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }
    // state = {
    //     collapsed: false,
    // }

    // toggleCollapsed = () => {
    //     this.setState({
    //         collapsed: !this.state.collapsed,
    //     })
    // }

    hasAuth = (item) => {
        // 判断当前登录的用于对item是否有权限
        const { key, isPublic } = item
        const { menus } = this.props.user.role
        const { username } = this.props.user
        // 1.如果当前用户是admin
        // 2.如果当前item是public
        // 3.当前用户有此item的权限:key有没有menus中
        if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            // 4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // 方法一: map + 递归调用
    getMenuNodes_map = (menuList) => {
        // 根据menu的数据数组生成对应的标签数组

        const path = this.props.location.pathname

        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {

                    if (item.key === path || path.indexOf(item.key) === 0) {
                        // 更新redux中的headTitle状态
                        this.props.setHeadTitle(item.title)
                    }

                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {

                    // 查找一个与当前请求路径匹配的子路由
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在,说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }

                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {
                                this.getMenuNodes_map(item.children)
                            }
                            {/* 递归调用 */}
                        </SubMenu>
                    )
                }
            }
        })
    }

    // 方法二:reduce + 递归调用
    // getMenuNodes_reduce = (menuList) => {
    //     return menuList.reduce((pre, item) => {
    //         if (!item.children) {
    //             // 向 pre 添加 <Menu.Item />
    //             pre.push((
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             ))
    //         } else {
    //             // 向 pre 添加 <SubMenu />
    //             pre.push((
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {
    //                         this.getMenuNodes_reduce(item.children)
    //                     }
    //                     {/* 递归调用 */}
    //                 </SubMenu>
    //             ))
    //         }
    //          return pre
    //     }, [])
    // }

    componentWillMount() {
        // 在第一次render之前执行一次
        // 此生命周期函数为第一个render准备数据[必须是同步的]
        this.menuNodes = this.getMenuNodes_map(menuList)
    }

    render() {

        // const menuNodes = this.getMenuNodes_map(menuList)

        let path = this.props.location.pathname
        // 取到当前请求的路由路径

        if (path.indexOf("/product") === 0) {
            // 表示当前请求的是 product 或者 product 的子路由
            path = "/product"
        }

        const openKey = this.openKey
        // 得到需要打开的菜单项项的key

        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <h1>React 管理后台</h1>
                </Link>

                <Menu
                    // defaultSelectedKeys={[path]}
                    // 默认选中
                    selectedKeys={[path]}
                    // 动态选中
                    defaultOpenKeys={[openKey]}
                    // 默认展开列表
                    mode="inline"
                    theme="dark"
                // inlineCollapsed={this.state.collapsed}
                >

                    {/* <Menu.Item key="/">
                        <Link to="/">
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to="/category">
                                <Icon type="pie-chart" />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to="/product">
                                <Icon type="pie-chart" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
                    {/* <Menu.Item key="/user">
                        <Link to="/user">
                            <Icon type="inbox" />
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                        <Link to="/role">
                            <Icon type="inbox" />
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="appstore" />
                                <span>图形图标</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/charts/bar">
                            <Link to="/charts/bar">
                                <Icon type="appstore" />
                                <span>柱形图</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/line">
                            <Link to="/charts/line">
                                <Icon type="appstore" />
                                <span>折线图</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie">
                            <Link to="/charts/pie">
                                <Icon type="appstore" />
                                <span>饼图</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
                    {
                        // this.getMenuNodes_map(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }), { setHeadTitle }
)(withRouter(LeftNav))

// withRouter高阶组件
// 包装非路由组件，返回一个新的组件
// 新的组件向非路由组件传递3个属性:history、match、location
