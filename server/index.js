const app = require("./app")
const connectDB = require("./config/db")




app.listen(process.env.PORT, ()=>{
    console.log("Server is Running")
})