const express = require('express');
const app = express();

//Now handle the incoming request

 // Works as startsWith
// app.use("/",(req , res)=>{
//     res.send('Hello from parent route')
// })
app.get("/user",(req , res)=>{
    console.log(req.query);
   res.send({firstName:"Rohit" , lastName:"Srivastava"}) 
})

app.get("/user/:userId/:name",(req , res)=>{
    console.log(req.query);
   res.send({firstName:"Rohit" , lastName:"Srivastava"}) 
})

app.use("/hello",(req , res)=>{
    res.send('Hello from hello')
})
app.use("/test",(req , res)=>{
    res.send('Hello from Test')
})

app.listen(3000,()=>{
    console.log('Server Listening on 3000 port ');
});