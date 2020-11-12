// product的默认子路由组件
import React, { Component } from 'react'
import { Card, Select, Input, Icon, Button, Table, message } from "antd"
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api"
import { PAGE_SIZE } from "../../utils/constants"
import LinkButton from "../../components/link-button"

const Option = Select.Option

class ProductHome extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    state = {
        total: 0,
        // 商品的总数量
        products: [],
        // 商品的数组
        loading: false,
        searchName: "",
        // 搜索的关键字
        searchType: "productName",
        // 搜索类型
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success("状态更新成功!")
            this.getProducts(this.pageNum)
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => "￥" + price
            },
            {
                title: '状态',
                width: 90,
                // dataIndex: 'status',

                render: (product) => {
                    const { _id, status } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type="danger"
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >{status === 1 ? "下架" : "上架"}</Button>
                            <span>{status === 1 ? "在售" : "售罄"}状态</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 80,
                render: (product) => {
                    // 将product对象 使用state传递给目标路由组件
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push("/product/detail", { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push("/product/addupdate", product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum) => {

        this.pageNum = pageNum
        // 保存pageNum

        this.setState({ loading: true })

        const { searchName, searchType } = this.state

        let result
        if (searchName) {
            // 搜索分页
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false })

        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                <Select
                    style={{ width: 150 }}
                    value={searchType}
                    onChange={
                        value => this.setState({ searchType: value })
                    }
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={
                        e => this.setState({ searchName: e.target.value })
                    }
                />
                <Button type="danger" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type="danger" onClick={() => this.props.history.push("/product/addupdate")}><Icon type='plus' />添加商品</Button>
        )

        return (
            <Card
                title={title}
                extra={extra}
            >
                <Table
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={
                        {
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            total: total,
                            // onChange:(pageNum) => this.getProducts(pageNum)
                            onChange: this.getProducts,
                            current:this.pageNum
                        }
                    }
                />
            </Card>
        )
    }
}

export default ProductHome