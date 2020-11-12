// product详情页的子路由

import React, { Component } from 'react'
import { Card, Icon, List } from "antd"
import LinkButton from "../../components/link-button"
import { BASE_IMG_URL } from "../../utils/constants"
import { reqCategory } from "../../api"

const Item = List.Item

class ProductDetail extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    state = {
        cNameOne: "",
        // 一级分类名称
        cNameTwo: "",
        // 二级分类名称
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        // 当前商品的分类ID
        if (pCategoryId === "0") {
            // 一级分类下的商品
            const result = await reqCategory(categoryId)
            const cNameOne = result.data.name
            this.setState({ cNameOne })
        } else {
            // 二级分类下的商品
            // const resultOne = await reqCategory(pCategoryId)
            // // 获取一级分类列表
            // const resultTwo = await reqCategory(categoryId)
            // // 获取二级分类列表
            // const cNameOne = resultOne.data.name
            // const cNameTwo = resultTwo.data.name
            // 通过多个await方式发多个请求:后面有个请求在前一个请求成功返回之后才发送

            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cNameOne = results[0].data.name
            const cNameTwo = results[1].data.name
            // 一次性发送多个请求,只有都成功了,才能正常处理

            this.setState({
                cNameOne,
                cNameTwo
            })
        }
    }

    render() {

        const { name, desc, price, detail, imgs } = this.props.location.state.product
        const { cNameTwo, cNameOne } = this.state

        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='left'
                        style={{ marginRight: 10, fontSize: 20 }}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card
                title={title}
                className="product-detail"
            >
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{cNameOne}  {cNameTwo ? ">" + cNameTwo : ""}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {/* <img className="product-img" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1405513753,2858193846&fm=26&gp=0.jpg" alt="" /> */}
                            {
                                imgs.map(i => <img className="product-img" src={BASE_IMG_URL + i} key={i} alt="" />)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                        {/* dangerouslySetInnerHTML 是 React 为浏览器 DOM 提供 innerHTML 的替换方案 
                        但当你想设置 dangerouslySetInnerHTML 时，需要向其传递包含 key 为 __html 的对象 */}
                    </Item>
                </List>
            </Card>
        )
    }
}

export default ProductDetail