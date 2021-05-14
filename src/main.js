import('./js/jq').then(res=>{
    console.log('加载jq')
})

setTimeout(() => {
    import('./js/jq').then(res=>{
        console.log('加载jq')
    })
}, 2000);