import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddForm extends Component {


    static propTypes = {
        setForm: PropTypes.func.isRequired,
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

        return (
            <Form>
                <Item label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator("roleName", {
                            initialValue: "",
                            rules: [
                                {
                                    required: true,
                                    message: "角色名称必须输入"
                                }
                            ]
                        })(
                            <Input placeholder="请输入角色名称"></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(AddForm);