import api from '../../utils/api'

const state = {
    loggedIn: false,
    info: {}
}
const mutations = {
    login(state, data) {
        state.loggedIn = true;
        state.info = data;
        api.defaults.headers.common['Token'] = state.info.token;
    },
    updateToken(state, token) {
        state.info.token = token;
    },
    logout(state) {
        state.loggedIn = false;
        state.info = {};
        api.defaults.headers.common['Token'] = '';
    }
}
const actions = {
    login({ commit }, form) {
        api.post('/auth/login', form).then(result => {
            commit('login', result);
        });
    },
    // 验证token有没有过期，没过期走成功回调续期，过期了走失败回调
    checkedLogin({ commit, state, dispatch }) {
        api.defaults.headers.common['Token'] = state.info.token;
        api.post('/auth/refreshToken', {}, { _slient: true })
            .then(token => {
                commit('updateToken', token);
            })
            .catch(() => {
                dispatch('logout');
            });
    },
    logout({ commit }) {
        commit('logout');
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}