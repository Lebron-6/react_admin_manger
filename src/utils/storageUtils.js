/*
进行local数据存储管理的工具模块
 */

import store from 'store'

const USER_KEY = "user_key"

export default {
    //保存user
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },
    //读取user
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || "{}")
        // 如果没有值返回一个空对象  默认返回的是null
        return store.get(USER_KEY) || {}
    },
    //删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}