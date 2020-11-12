import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {


    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
        // 将form对象通过setForm()传递给父组件
    }

    render() {

        const { getFieldDecorator } = this.props.form
        // 使用 getFieldDecorator 需要先使用 Form.create 高阶函数包装
        // 可以收集数据 初始化 验证...

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }

        const { roles } = this.props
        const user = this.props.user || {}

        return (
            <Form {...formItemLayout}>
                <Item label="用户名" >
                    {
                        getFieldDecorator("username", {
                            initialValue: user.username,
                            rules: [
                                {
                                    required: true,
                                    message: "用户名必须输入"
                                }
                            ]
                        })(
                            <Input placeholder="请输入用户名称"></Input>
                        )
                    }
                </Item>
                {
                    user._id ? "" : (
                        <Item label="密码" >
                            {
                                getFieldDecorator("password", {
                                    initialValue: user.password,
                                    rules: [
                                        {
                                            required: true,
                                            message: "密码必须输入"
                                        }
                                    ]
                                })(
                                    <Input type="password" placeholder="请输入密码"></Input>
                                )
                            }
                        </Item>
                    )
                }
                <Item label="电话" >
                    {
                        getFieldDecorator("phone", {
                            initialValue: user.phone,
                            rules: [
                                {
                                    required: true,
                                    message: "电话号码必须输入"
                                }
                            ]
                        })(
                            <Input placeholder="请输入电话号码"></Input>
                        )
                    }
                </Item>
                <Item label="邮箱" >
                    {
                        getFieldDecorator("email", {
                            initialValue: user.email,
                        })(
                            <Input placeholder="请输入邮箱"></Input>
                        )
                    }
                </Item>
                <Item label="角色" >
                    {
                        getFieldDecorator("role_id", {
                            initialValue: user.role_id,
                        })(
                            <Select>
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UserForm);