function getTrue(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(true)
        },5000);
    })
}

module.exports=getTrue;