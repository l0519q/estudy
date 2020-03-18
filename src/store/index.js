import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

// 引入数据持久化插件，实现持久登陆
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user
    },
    plugins: [
        createPersistedState({
            key: 'eStudy',
            paths: ['user'],
            subscriber(store) {
                store.dispatch('user/checkedLogin');
                return handler => store.subscribe(handler);
            }
        })
    ]
})
