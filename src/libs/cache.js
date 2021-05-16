class CacheModel {
    /**
     *
     * 设置缓存
     * @param {*} key
     * @param {*} value
     */
    setStorage = (key, value) => {
        try {
            localStorage.setItem(key, value)
        } catch (e) {
            throw new Error("缓存失败")
        }
    }
    /**
     * 设置缓存以及过期时间
     * @param {*} key
     * @param {*} value
     * @param {*} expires 过期时间，单位：毫秒
     */
    setStorageExt = (key, value, expires) => {
        let params = { key, value, expires };
        expires = parseInt(expires) || false;
        // let timestamp = Date.parse(new Date());
        let timestamp = new Date().getTime();
        // console.log(timestamp)
        if (!expires) {
            throw new Error("请传入过期时间")
        }
        let assignParams = Object.assign(params, { startTime: timestamp })
        try {
            localStorage.setItem(key, JSON.stringify(assignParams))
        } catch (e) {
            throw new Error(e)
        }
    }

    /**
     * 获得缓存，如果缓存时间过期会删除该缓存并且返回null
     * @param {*} key
     */
    getStorageExt = (key) => {
        let storage = JSON.parse(localStorage.getItem(key))
        let nowTimestamp = new Date().getTime();
        if (storage) {
            // 当前时间戳大于开始的时间加上过期时间，代表还没过期
            let data = nowTimestamp >= (storage.startTime + storage.expires) ? (() => {
                // 过期
                return this.clearStorage(key)
            })() : (() => {
                // 没过期
                return storage.value
            })()
            return data
        } else {
            return null
        }
    }
    /**
     *
     *获取缓存
     * @param {*} key
     */
    getStorage = (key) => {
        return localStorage.getItem(key);
    }

    /**
     * 清除特定缓存
     * @param {*} key 
     */
    clearStorage = (key) => {
        return localStorage.removeItem(key)
    }

}

export default new CacheModel()