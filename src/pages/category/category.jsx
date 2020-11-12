// 商品分类路由

import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

class Category extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }
    state = {
        categorys: [],
        // 一级分类列表
        loading: false,
        parentId: "0",
        // 当前需要显示的分类列表的父分类ID
        parentName: "",
        // 当前需要显示的分类列表的父分类名称
        subCategorys: [],
        // 二级分类列表
        showStatus: 0,
        // 标识添加/更新的确认框是否显示
        // 0：表示都不显示 1：显示添加 2：显示修改
    }

    initColumns = () => {
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: "27%",
                render: (category) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.showUpdateCategory(category)}>修改</LinkButton>
                            {
                                this.state.parentId === "0" ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看</LinkButton> : null
                            }
                        </span>
                    )
                }
            },
        ]
    }

    getCategorys = async (parentId) => {
        // 异步获取一级/二级分类列表显示
        // parentId:如果没有指定根据状态中的parentId请求,如果指定了根据指定的请求
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        // 0表示一级分类
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === "0") {
                this.setState({ categorys: categorys })
                // 更新一级分类列表
            } else {
                this.setState({ subCategorys: categorys })
                // 更新二级分类列表
            }
        } else {
            message.error("数据获取失败!")
        }
    }

    showSubCategorys = (category) => {
        // 显示指定一级分类对象的二级子列表
        this.setState({
            parentId: category._id,
            parentName: category.name
            // this.setState为异步更新
        }, () => {
            this.getCategorys()
        })
    }

    showCategorys = () => {
        // 显示一级列表状态
        this.setState({
            parentId: "0",
            parentName: "",
            subCategorys: []
        })
    }

    showAddCategory = () => {
        this.setState({ showStatus: 1 })
    }

    showUpdateCategory = (category) => {
        this.category = category
        // 保存分类对象
        this.setState({ showStatus: 2 })
    }

    addCategory = () => {

        this.form.validateFields(async (err, values) => {
            //获取所有输入框的值（value），并且获取到输入框是否报错(error)。
            if (!err) {
                this.setState({ showStatus: 0 })

                // const { categoryName, parentId } = this.form.getFieldsValue()
                const { categoryName, parentId } = values
                // 收集数据,并提交添加分类的请求

                this.form.resetFields()

                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        // 添加的分类就是当前分类列表下的分类
                        this.getCategorys()
                    } else if (parentId === "0") {
                        // 在二级分类列表下添加一级分类,重新获得一级分类列表,但不需要显示一级列表
                        this.getCategorys("0")
                    }
                }
            }
        })
    }

    updateCategory = () => {

        this.form.validateFields(async (err, values) => {
            // 先进行表单验证,只有先通过表单验证才能处理
            if (!err) {
                this.setState({ showStatus: 0 })

                const categoryId = this.category._id
                // const categoryName = this.form.getFieldValue('categoryName')
                const { categoryName } = values
                // 准备数据

                this.form.resetFields()
                // 清除所有数据

                // antd中form中resetFields清空输入框
                // 1.如果没有initValue的情况下，直接使用resetFields可以清空文本框的值
                // 2.如果是有initValue的情况下，直接使用resetFields方法会直接重置为initValue的值
                // 归根结底：是因为设置initValue的时候，直接设置了input的value的默认值。

                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    this.getCategorys()
                    // 重新显示列表
                }
            }
        })
    }

    /*
    响应点击取消: 隐藏确定框
     */
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // 发送异步请求
        this.getCategorys()
    }

    render() {
        // const dataSource = [
        //     {
        //         "parentId": "0",
        //         "_id": "1",
        //         "name": "手机",
        //         "_v": 0
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "2",
        //         "name": "电脑",
        //         "_v": 0
        //     },
        //     {
        //         "parentId": "0",
        //         "_id": "3",
        //         "name": "平板",
        //         "_v": 0
        //     },

        // ]

        const {
            categorys,
            loading,
            subCategorys,
            parentId,
            parentName,
            showStatus
        } = this.state

        const category = this.category || {}
        // 读取指定的分类

        const title = parentId === "0" ? '一级列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级列表</LinkButton>
                <Icon type="right" />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type="danger" onClick={this.showAddCategory}>
                <Icon type="plus"></Icon>添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === "0" ? categorys : subCategorys}
                    columns={this.columns}
                    bordered={true}
                    // 边框
                    rowKey="_id"
                    pagination={{ defaultPageSize: 7, showQuickJumper: true }}
                    // 分页 每页显示的条数
                    // showQuickJumper:true 支持快速跳转到某页
                    loading={loading}
                // 加载动画
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}

export default Category