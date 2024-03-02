require('dotenv').config()
const express=require('express');
const app=express();
const user_route=require('./routes/users');
const order_route=require('./routes/orders');
/*eslint-disable no-unused-vars*/                    //this comment is used to disable the variables unused rule for this file.
app.use(express.json());

app.use('/user',user_route);
app.use('/order',order_route);



app.use('/',(err,req,res,next)=>{
    if(err.message=="Validation failed"){
            console.log(err);
            const validationErrorDetails = err.details.get('body') || err.details.get('headers');
            const errorMessage = validationErrorDetails.details[0].message;
            res.status(422).send(errorMessage);
    }
    console.log(err);
    res.status(err.status).json({ error: err.message });
});


app.listen(5000);