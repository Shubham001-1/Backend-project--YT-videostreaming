
import connect_db  from "./db/index.js";
import 'dotenv/config'
import {app} from "./app.js";
connect_db()
.then(()=>{
    app.listen(process.env.port || 8000 , ()=>{
        console.log("server is running on port 8000")
    })
})
.catch((err)=>{
    console.log("unable to connect to db", err);
})
