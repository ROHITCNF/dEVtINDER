const express = require("express");
const app = express();

//Now handle the incoming request

// Works as startsWith
// app.use("/",(req , res)=>{
//     res.send('Hello from parent route')
// })
// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send({ firstName: "Rohit", lastName: "Srivastava" });
// });

// app.get("/user/:userId/:name", (req, res) => {
//   console.log(req.query);
//   res.send({ firstName: "Rohit", lastName: "Srivastava" });
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello from hello");
// });
// app.use("/test", (req, res) => {
//   res.send("Hello from Test");
// });

//app.use('/route',[rH1,rH2,rH3,rH4]);
app.use(
  "/user",
  (req, res, next) => {
    console.log("response 1");
    // res.send("Response 1");
    next();
  },
  (req, res, next) => {
    console.log("response 2");
    // res.send("Response 2");
    next();
  },
  (req, res, next) => {
    console.log("response 3");
    // res.send("Response 3");
    next();
  },
  (req, res, next) => {
    console.log("response 4");
    // res.send("Response 4");
    next();
  }
);

app.listen(3000, () => {
  console.log("Server Listening on 3000 port");
});
