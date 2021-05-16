import utils from "@/libs/utils";


const app = {
    // namespaced: true,
    state: {
        title: 'Vue-iview-admin',
        tagOpenPageList: [
            {
                name: 'dashboard',
                meta: {
                    title: '控制台'
                },
            },
        ],
        activeTagOpenPage: "dashboard"
    },
    mutations: {
        changeActiveTagOpenPage(state, v) {
            state.activeTagOpenPage = v
        },
        addTagOpenPage(state, item) {
            state.tagOpenPageList.push(item)
        },
        delTagOpenPage(state, name) {
            // 删除打开的页面tag，并更新当前页面tag
            state.tagOpenPageList.forEach((item, index) => {
                if (item.name == name) {
                    state.tagOpenPageList.splice(index, 1)
                    // index == state.tagOpenPageList.length ? state.tagOpenPageList.length - 1 : index
                    // state.activeTagOpenPage = state.tagOpenPageList[index].name
                }

            })
        },
        editTagOpenPage(state, val) {
            // 删除打开的页面tag，并更新当前页面tag
            state.tagOpenPageList.forEach((item, index) => {
                if (item.name == val.name) {
                    // state.tagOpenPageList.splice(index, 1)
                    state.tagOpenPageList[index] = val
                    // index == state.tagOpenPageList.length ? state.tagOpenPageList.length - 1 : index
                    // state.activeTagOpenPage = state.tagOpenPageList[index].name
                }

            })
        },
    },
    actions: {
        
    },

}

export default app