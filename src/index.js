/*
入口js
 */
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from "react-redux"
import App from './App'

// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'

import store from "./redux/store"

// const user = storageUtils.getUser()
// memoryUtils.user = user

ReactDom.render(
    (
        <Provider store={store}>
            <App />
        </Provider>
    )
    , document.getElementById('root'))