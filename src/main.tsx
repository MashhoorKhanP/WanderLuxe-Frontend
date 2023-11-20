import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ToastContainer/>
    <App/>
  </Provider>
)
