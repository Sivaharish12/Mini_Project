const {DateTime}=require('luxon')

exports.getime=()=>{
    console.log(DateTime.fromMillis(1708927374621).toISODate());
    return DateTime.fromMillis(1708927374621).toISODate()
}

