import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { Modal } from 'antd'
import { formateDate } from "../../utils/dateUtils"
import { reqWeather } from "../../api"
import { connect } from "react-redux"
import { logout } from "../../redux/actions"
// import memoryUtils from "../../utils/memoryUtils"
// import storageUtils from "../../utils/storageUtils"
import menuList from "../../config//menuConfig"
import LinkButton from "../link-button"
import "./index.less"

class Header extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }

    state = {
        currentTime: "",
        dayPictureUrl: "",
        // 天气图片url
        weather: "",
        // 当前天气的文本
    }

    logout = () => {
        Modal.confirm({
            title: '你确定要退出登录吗?',
            // content: 'Some descriptions',
            onOk: () => {
                // console.log('OK')
                // storageUtils.removeUser()
                // memoryUtils.user = {}
                // this.props.history.replace('/login')
                this.props.logout()
            },
            onCancel() {
                // console.log('Cancel')
            },
        })
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    getTime = () => {
        // 每隔1s获取当前时间, 并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        // 调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('益阳')
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }

    componentDidMount() {
        // 第一次render之后执行一次
        // 一般在此执行异步操作:发送ajax请求/启动定时器
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {

        const { currentTime, dayPictureUrl, weather } = this.state
        const username = this.props.user.username
        // const title = this.getTitle()
        const title = this.props.headTitle

        return (
            <div className="header">
                <div className="header-top">
                    <span>Hello! {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        headTitle: state.headTitle,
        user: state.user
    }),
    {
        // mapDispatchToProps
        logout
    }
)(withRouter(Header))