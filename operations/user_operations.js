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
        throw err
    } 
}

async function update_user(id,body){
    try{
        const user = await db.sequelize.models.user.findOne({ where: { id } });
        if(user){
            await Object.assign(user, body);  //the Object.assign will replace the values in the req.body to the existing user object
            await user.save();  //reflect the changes in the user object in the database
            return user;
        }
        else throw new Error("User is not registered");
    }
   catch(err){
    throw err;
   }
}

module.exports={create_user,verify_user,update_user};


