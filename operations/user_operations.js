const db=require('../models/index');
const bcrypt=require('bcrypt');

async function create_user(...userdetail){
    try{
        console.log(userdetail);
        const[username,mail,password,,mobile]=userdetail;
        const hashedpassword=await bcrypt.hash(password,10);
        console.log(hashedpassword);
        const user=await db.sequelize.models.user.create({username,mail,password:hashedpassword,mobile});
        console.log(user.dataValues);
        return user.dataValues;
    }
    catch(err){
        const customError = new Error("The datatype provided is not valid");
        customError.status = 400; 
        throw customError;
    }
}

async function verify_user(...userdetail){
    try{
        const[mail,password]=userdetail;
        const user=await db.sequelize.models.user.findOne({where:{mail}});
        if(user){
            if(await bcrypt.compare(password,user.password)){
                return user.dataValues;
            }
            else{
                const passwordMismatchError = new Error("Password does not match");
                passwordMismatchError.status = 401; // Unauthorized
                throw passwordMismatchError;
            }
        }
        else{
            const userNotFoundError = new Error("The user is not valid");
            userNotFoundError.status = 404; // Not Found
            throw userNotFoundError;
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


