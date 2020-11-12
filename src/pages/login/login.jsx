import React, { Component } from "react"
import { Form, Icon, Input, Button } from "antd"
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { login } from "../../redux/actions"

// import { reqLogin } from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from "../../utils/storageUtils"
import "./login.less"

class Login extends Component {
  // constructor(props) {
  //     super(props)
  //     this.state = {}
  // }
  handleSubmit = (e) => {
    //   阻止事件的默认行为
    e.preventDefault()

    const form = this.props.form

    form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        const { username, password } = values

        this.props.login(username, password)

        // const result = await reqLogin(username, password)
        // // console.log("success", result)
        // if (result.status === 0) {
        //   message.success("登录成功!")
        //   const user = result.data
        //   memoryUtils.user = user //保存在内存中
        //   storageUtils.saveUser(user)  //保存到本地缓存中
        //   // 跳转之前先保存user信息
        //   this.props.history.replace('/home')
        //   // 在事件回调中实现跳转
        // } else {
        //   message.error(result.msg)
        // }
        // .then(result => {
        //   console.log("success", result)
        // })
        // .catch(error => {
        //   console.log(error)
        // })
      } else {
        console.log("error")
      }
    })

    // const values = form.getFieldsValue()
    // console.log(values)
  }

  //   validatePwd = (rule,value,callback) => {
  //     // 注意:callback必须被调用
  //     callback() //验证通过
  //     callback('xxx')  //验证失败 并指定提示文本
  //   } 

  render() {
    // const user = memoryUtils.user
    const user = this.props.user
    if (user && user._id) {
      // 如果用户已经登录 则自动跳转到主页
      return <Redirect to="/" />
    }

    const errorMsg = this.props.user.errorMsg

    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <header className="login-header">
          <h1>React后台管理系统</h1>
        </header>
        <section className="login-content">
          <div>{errorMsg}</div>
          <h2>登录 / 注册</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("username", {
                //   配置对象:属性名是特殊的一些名词

                // 声明式验证:直接使用别人定义好的验证规则进行验证
                rules: [
                  { required: true, whitespace: true, message: "用户名不能为空!" },
                  //   whitespace:true 输入空格无效
                  { min: 4, message: "用户名最小长度为4!" },
                  { max: 12, message: "用户名最大长度为12!" },
                  {
                    pattern: /^[a-zA-Z0-9_]{4,12}$/,
                    message: "用户名必须字母，数字，下划线",
                  },
                ],
                initialValue: "admin"
                // 初始值
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
                // prefix带有前缀图标的input
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, whitespace: true, message: "密码不能为空!" },
                  { min: 4, message: "密码最小长度为4!" },
                  { max: 12, message: "密码最大长度为12!" },
                  {
                    pattern: /^[a-zA-Z0-9_]{4,12}$/,
                    message: "密码必须字母，数字，下划线",
                  },
                  //   {
                  //       validator:this.validatePwd
                  //     //   自定义验证
                  //   }
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              {/* {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="">
                Forgot password
              </a> */}
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              {/* Or <a href="">register now!</a> */}
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

// 包装Form组件生产一个新的组件:Form(Login)
// 新组建会向Form组件传递有强大的对象属性:form
const WrappedNormalLoginForm = Form.create()(Login)
export default connect(
  state => ({ user: state.user }), { login }
)(WrappedNormalLoginForm)

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */

/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */
