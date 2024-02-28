const db=require('../models/index');

async function create_user(...userdetail){
    try{
        console.log(userdetail);
        const[username,mail,password,confirm_password,mobile]=userdetail;
        const user=await db.sequelize.models.user.create({username,mail,password,confirm_password,mobile});
        console.log(user.dataValues);
        return user.dataValues;
    }
    catch(err){
        throw new Error("The datatype provided is not valid")
    }
}

async function verify_user(...userdetail){
    try{
        const[mail,password]=userdetail;
        const user=await db.sequelize.models.user.findOne({where:{mail,password}});
        if(user){
            return user.dataValues;
        }
        else{
            throw new Error("The user is not valid")
        }
    }
    catch(err){
        console.log(err);
        throw err
    } 
}

async function update_user(id,{username,mail,password,mobile}){
    const updated_user= await db.sequelize.models.user.update({username,mail,password,mobile}, {
            where: { id },
            returning: true,
        });
    return updated_user

}

module.exports={create_user,verify_user,update_user};


