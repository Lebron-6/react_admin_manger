// product的添加和更新的子路由组件

import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from "antd"
import { reqCategorys, reqAddOrUpdateProduct } from "../../api"
// Cascader级联选择
import LinkButton from "../../components/link-button"
import PicturesWall from "./pictures-wall"
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input


class ProductAddUpdate extends Component {

    state = {
        options: [],
    }

    constructor(props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            // * 1 是为了把value转换成number类型
            callback()
            // 验证通过
        } else {
            callback("价格需大于0!")
            // 验证未通过
        }
    }

    submit = () => {
        // 进行整体的表单验证
        this.props.form.validateFields(async (err, val) => {
            // 校验并获取一组输入域的值与 Error
            if (!err) {

                const { name, desc, price, categoryIds } = val
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = "0"
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = { name, desc, price, imgs, detail,pCategoryId,categoryId }

                if (this.isUpdate) {
                    product._id = this.product._id
                }

                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? "修改" : "添加"}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? "修改" : "添加"}商品失败!`)
                }
            }
        })
    }

    initOptions = async (categorys) => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== "0") {
            const subCategorys = await this.getCategorys(pCategoryId)
            // 获取对应的二级分类列表
            const childOptions = subCategorys.map(c => ({
                // 生成一个二级列表的options
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            const targetOption = options.find(option => option.value === pCategoryId)
            // 找到当前商品对应的一级option对象

            targetOption.children = childOptions
            // 再关联到当前的option上
        }

        this.setState({
            options
        })
    }

    getCategorys = async (parentId) => {
        // 异步获取一级/二级分类列表显示
        // parentId:如果没有指定根据状态中的parentId请求,如果指定了根据指定的请求

        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        // 0表示一级分类

        if (result.status === 0) {
            const categorys = result.data
            if (parentId === "0") {
                this.initOptions(categorys)
            } else {
                return categorys
            }
        } else {
            message.error("数据获取失败!")
        }
    }


    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions)
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        const subCategorys = await this.getCategorys(targetOption.value)
        // 根据选中的分类,请求获取二级分类列表

        targetOption.loading = false

        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                // 生成一个二级列表的options
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
            // 再关联到当前的option上
        } else {
            // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        })
    }

    componentWillMount() {
        const product = this.props.location.state
        // 如果是添加 没有值    更新才有值
        this.isUpdate = !!product
        // 俩个!表示强制转换成布尔类型   保存是否更新的标识

        this.product = product || {}
        // 保存商品
    }

    componentDidMount() {
        this.getCategorys("0")
    }

    render() {

        const { isUpdate, product } = this

        const { pCategoryId, categoryId, imgs, detail } = product

        const categoryIds = []
        // 用来接收级联分类ID的数组
        if (isUpdate) {
            if (pCategoryId === "0") {
                // 一级分类的商品
                categoryIds.push(categoryId)
            } else {
                // 二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon
                        type='left'
                        style={{ marginRight: 10, fontSize: 20 }}
                    />
                </LinkButton>
                <span>{isUpdate ? "修改商品" : "添加商品"}</span>
            </span>
        )

        const formItemLayout = {
            // 指定Item布局的配置对象
            labelCol: { span: 2 },
            // 左侧 label 宽度
            wrapperCol: { span: 8 }
            // 右侧包裹框的宽度
        }

        const { getFieldDecorator } = this.props.form
        // 表单验证

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator("name", {
                                // 用于和表单进行双向绑定
                                initialValue: product.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '必须输入商品名称!',
                                    },
                                ]
                            })(<Input placeholder="请输入商品名称" />)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator("desc", {
                                // 用于和表单进行双向绑定
                                initialValue: product.desc,
                                rules: [
                                    {
                                        required: true,
                                        message: '必须输入商品描述!',
                                    },
                                ]
                            })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator("price", {
                                // 用于和表单进行双向绑定
                                initialValue: product.price,
                                rules: [
                                    {
                                        required: true,
                                        message: '必须输入商品价格!',
                                    },
                                    {
                                        validator: this.validatePrice
                                    }
                                ]
                            })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" />)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator("categoryIds", {
                                // 用于和表单进行双向绑定
                                initialValue: categoryIds,
                                rules: [
                                    {
                                        required: true,
                                        message: '必须选择商品分类!',
                                    }
                                ]
                            })(<Cascader
                                placeholder="请选择商品分类"
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item >
                        <Button style={{ width: 343, marginLeft: 135 }} type="danger" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)


/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */