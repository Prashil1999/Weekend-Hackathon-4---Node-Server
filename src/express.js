const express=require("express");
const Joi =require("joi");
var app=express();

let users=[
    {id:1,name:"prashil",age:20},
    {id:2,name:"darshan",age:19}
];

//getting data from post request json->js object
app.use(express.json());

//get request
app.get("/api/v1/users",(req,res)=>{
    res.send(users);
});

app.get("/api/v1/users/:id",(req,res)=>{
    let id=req.params.id;

    //invalid id->400
    if(isNaN(Number(id))){
        res.status(400).send("id is in invalid formate");
        return;
    }

    let user=users.filter((user)=>user.id===Number(id));
    
    //not found->404
    if(user.length===0){
        res.status(404).send(`user with ${id} is not found`);
        return;
    }

    //send user->200 ok
    res.send(user[0]);
});

//post request
app.post("/api/v1/users",(req,res)=>{
    //validation using Joi schema ->400
    let schema=Joi.object({
        name : Joi.string().trim().min(1).required(),
        age:Joi.number().min(1).max(150).required()
    });
    let validationObject=schema.validate(req.body);
    if(validationObject.error){
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    //add user to list
    let user={id:Number(users.length+1),...req.body};
    users.push(user);
    
    //response with new added item->200 ok
    res.send(user);
});

app.put("/api/v1/users/:id",(req,res)=>{
    let id=req.params.id;

    //validate for valid id formate
    let idValidationObject=Joi.number().validate(Number(id));
    if(idValidationObject.error){
        res.status(400).send("id "+idValidationObject.error.details[0].message);
        return; 
    }

    let userIndex=users.findIndex((user)=>user.id===Number(id));
    
    //404 not found
    if(userIndex===-1){
        res.status(404).send(`user with id ${id} is not found`);
        return;
    }
    //validation using Joi schema ->400
    let schema=Joi.object({
        name : Joi.string().trim().min(1).required(),
        age:Joi.number().min(1).max(150).required()
    });
    let validationObject=schema.validate(req.body);
    if(validationObject.error){
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    users.splice(userIndex,1,{id:Number(id),...req.body});
    res.send(users[userIndex]);

});

app.listen(8081,()=>{console.log("listen")});