// 角色路由

import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from "antd"
import { PAGE_SIZE } from "../../utils/constants"
import { reqAddRole, reqRoles, reqUpdateRole } from "../../api"
import { connect } from "react-redux"
import { logout } from "../../redux/actions"
// import storageUtils from "../../utils/storageUtils"
import { formateDate } from "../../utils/dateUtils"
import AddForm from "./add-form"
import AuthForm from "./auth-form"


class Role extends Component {

    state = {
        roles: [],
        // 所有角色的列表
        role: {},
        // 选中的列表
        isShowAdd: false,
        isShowAuth: false,
    }

    constructor(props) {
        super(props)

        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name"
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time)
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: "授权人",
                dataIndex: "auth_name"
            },
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    onRow = (role) => {
        return {
            onClick: e => {
                this.setState({ role })
            }
        }
    }

    addRole = () => {
        this.form.validateFields(async (err, val) => {
            if (!err) {
                const { roleName } = val
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success("角色添加成功!")
                    // this.getRoles()
                    // 方法二
                    const role = result.data
                    // const roles = this.state.roles 不建议直接操作state里面的数据
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({ roles })
                    // 更新roles状态:基于原本的状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error("角色添加失败!")
                }
            }
        })

        this.setState({ isShowAdd: false })
    }

    updateRole = async () => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        const result = await reqUpdateRole(role)
        this.setState({ isShowAuth: false })
        if (result.status === 0) {
            message.success("权限设置成功!")
            // this.getRoles()
            // 如果当前更新的是自己角色的权限,强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                // this.props.user = {}
                // storageUtils.removeUser()
                message.success("当前用户权限被修改,清重新登录!")
                // this.props.history.replace("/login")
            } else {
                message.success("权限设置成功!")
                this.setState({
                    roles: [...this.state.roles]
                })
            }

        } else {
            message.error("权限设置失败!")
        }
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type="danger" onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;&nbsp;&nbsp;
                <Button type="danger" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered={true}
                    rowKey="_id"
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            // 选择某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    // 表格行是否可选择
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                    }}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}

export default connect(
    state => ({ user: state.user }), { logout }
)(Role)