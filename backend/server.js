const express=require("express")
const dotenv=require("dotenv").config()
const cors=require("cors")
const {MongoClient}=require("mongodb")
const assert=require("assert")

const app=express()
app.use(express.json())
app.use(cors())
const port=process.env.PORT||4000
const client=new MongoClient(process.env.URL,{useUnifiedTopology:true})

app.get("/",(req,res)=>{
    res.send("Hello")
})
app.post("/",(req,res)=>{
    console.log("recieved....!")
    console.log(req.body)    
    client.connect((err)=>{
        assert.equal(null,err)
        const db=client.db(process.env.DB_NAME)
        const cars=db.collection("Cars")
        // cars.find({},
        //     {
        //         projection:{_id:0,id:0,origin:0}
        //     })
        //     .toArray((err,doc)=>{
        //         if (err)
        //             console.log(err)
        //         console.log(doc)
        //     })
        cars.find({
            "loc":{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[+req.body.latitude,+req.body.longitude]
                    }
                }
            }
        },
        {
            projection:{
                _id:0,
                id:0,
                Origin:0
            }
        })
        .toArray((err,doc)=>{
            assert.equal(null,err)
            console.log(doc.slice(0,5))
            res.send(doc.slice(0,5))
        })
    })
})


app.listen(port,()=>{
    console.log("Server is ready to hear...",port)
})