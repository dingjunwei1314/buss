const action = {
    state: {
        counter: 0
    },
    mutations: {
        TRIGGER_REFRESH(state) {
            state.counter++
        }
    },
    actions: {
        triggerRefresh({ commit, state }) {
            commit('TRIGGER_REFRESH');
        },
    }
}

export default action