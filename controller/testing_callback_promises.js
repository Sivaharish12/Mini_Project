function getTrue(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(true)
        },5000);
    })
}

module.exports=getTrue;