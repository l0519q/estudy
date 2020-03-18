import Vue from 'vue'
import App from './App.vue'
import store from './store'

// 引入 Ant Design 组件
import { Button, Layout, Input, Icon, Table, Upload, Modal, Popconfirm, Form, Select, LocaleProvider, DatePicker, notification, message } from 'ant-design-vue'

Vue.use(Button)
Vue.use(Layout)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Table)
Vue.use(Upload)
Vue.use(Modal)
Vue.use(Popconfirm)
Vue.use(Form)
Vue.use(Select)
Vue.use(LocaleProvider)
Vue.use(DatePicker)

Vue.$notification = notification
Vue.prototype.$message = message

// 引入 VeeValidate 验证登录框信息
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
extend('required', {
  ...required,
  message: '{_field_}是必须的'
})


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
