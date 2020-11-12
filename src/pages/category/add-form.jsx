import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {}
    // }


    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
        // 将form对象通过setForm()传递给父组件
    }

    render() {

        const { parentId, categorys } = this.props

        const { getFieldDecorator } = this.props.form
        // 使用 getFieldDecorator 需要先使用 Form.create 高阶函数包装
        // 可以收集数据 初始化 验证...
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator("parentId", {
                            initialValue: parentId //默认值
                        })(
                            <Select>
                                <Option value="0">一级分类</Option>
                                {
                                    categorys.map(item => {
                                        return <Option value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("categoryName", {
                            initialValue: "",
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

export default Form.create()(AddForm);