// 用户路由

import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from "antd"
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button"
import { PAGE_SIZE } from "../../utils/constants"
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api"
import UserForm from "./user-form"

const { confirm } = Modal

class User extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    state = {
        users: [],
        roles: [],
        isShow: false,
    }

    initColumns = () => {
        this.columns = [
            {
                title: "用户名",
                dataIndex: "username"
            },
            {
                title: "邮箱",
                dataIndex: "email"
            },
            {
                title: "电话",
                dataIndex: "phone"
            },
            {
                title: "注册时间",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time)

            },
            {
                title: "所属角色",
                dataIndex: "role_id",
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: "操作",
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deletdUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    deletdUser = (user) => {
        confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success("删除用户成功!")
                    this.getUsers()
                } else {
                    message.error("删除用户失败!")
                }
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    showUpdate = (user) => {
        this.user = user
        this.setState({ isShow: true })
    }

    addOrUpdateUser = async () => {

        this.setState({ isShow: false })

        const user = this.form.getFieldsValue()
        this.form.resetFields()

        if (this.user) {
            // 如果是更新,需要给user指定_id属性
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)

        if (result.status === 0) {
            message.success(`${this.user ? "修改" : "添加"}用户成功!`)
            this.getUsers()
        }
    }

    initRoleNames = (roles) => {
        // 根据role的数组,生成包含所有角色名的对象(属性名用角色id值)
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({ users, roles })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {

        const title = (<Button type="danger" onClick={() => {
            this.user = null
            // 清除前面保存的user
            this.setState({ isShow: true })
        }}>创建用户</Button>)

        const { users, isShow, roles } = this.state

        const { user } = this

        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered={true}
                    rowKey="_id"
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />
                <Modal
                    title={user ? "修改用户" : "添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}

export default User
