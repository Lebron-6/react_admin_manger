import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

class UpdateForm extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {}
    // }
    static propTypes = {
        // 指定数据类型
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
        // 将form对象通过setForm()传递给父组件
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { categoryName } = this.props

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator("parentName", {
                            initialValue: categoryName,
                            rules: [
                                {
                                    required: true,
                                    message: "分类名称必须输入"
                                }
                            ]
                        })(
                            <Input placeholder="请输入分类名称"></Input>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UpdateForm)
