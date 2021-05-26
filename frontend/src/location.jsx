import React,{useState} from "react"
import axios from "axios"
import "./Styles/style.css"
function Location(){
    let [loc,setLoc]=useState({
        latitude:null,
        longitude:null,
        access:false,
        msg:"Click Location for access"
    });        
    let [data,setData]=useState([])
    function getLoc(){
        let newData={...loc}
        navigator.geolocation.getCurrentPosition((pos)=>{
            newData["latitude"]=pos.coords.latitude;
            newData["longitude"]=pos.coords.longitude;            
            newData["access"]=true;            
            newData["msg"]="permission granted";            
            setLoc(newData)
            console.log(newData)
        },
        (err)=>{            
            newData["msg"]=err.message;
            newData["access"]=false;     
            setLoc(newData)    
            console.log(newData)   
        })
        let postData={
            latitude:loc.latitude,
            longitude:loc.longitude
        }
        axios.post("http://localhost:4000/",postData)
        .then((res)=>{
            console.log(res)
            setData(res.data)
        })
        .catch((err)=>{
            console.log(err,"error...")
        })
    };
    
    function getCars(){
        if (loc.latitude && loc.longitude){
            console.log(loc)
            let postData={
                latitude:loc.latitude,
                longitude:loc.longitude
            }       
              
            axios.post("http://localhost:4000/",postData)
            .then((res)=>{
                console.log(res)
                setData(res.data)
            })
            .catch((err)=>{
                console.log(err,"error...")
            })
        }
    }
    function setCoord(event){
        let newData={...loc}
        newData[event.target.id]=event.target.value
        newData["access"]=true        
        setLoc(newData)        
    }
    const sty={
        margin:"5% auto",
        maxWidth:"30%",                           
        height:"auto",
        border:"3px solid black",
        padding:"10px 0",
        textAlign:"center",
        backgroundColor:"#4BD459"
    }
    const inner={
        display:"flex",
        flexDirection:"column",            
        width:"60%",
        margin:"auto"
    }
    const inp={            
        padding:"10px",            
        border:"3px solid black",
        borderRadius:"30px",
        fontFamily:"cursive",
        fontWeight:"bold",
        outline:"none"
    }
    const table={
        margin:"5% auto",
        maxWidth:"50%",                           
        height:"auto",        
        padding:"10px 0",
        textAlign:"center",        
    }    
    
    // const nearCars=(data.length)?data.map((obj,ind)=>{`<p>${obj}</p>`}):""
    function tableDisplay(){
        return <>
            <h2>Nearest Cars from your place are</h2>
            <table className="table">
            <thead ><
                tr>
                    <th scope="col" >###</th>
                    <th scope="col" >Name</th>
                    <th scope="col" >Mobile</th>
                    <th scope="col" >location coords</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.length?                            
                    data.map((obj,ind)=>{
                        return <tr>
                                <td scope="row">{ind+1}</td>
                                <td >{obj.Name}</td>
                                <td >{obj.mobile}</td>
                                <td >{obj.loc.coordinates[0]+", "+obj.loc.coordinates[1]}</td>
                            </tr>                                                             
                    })
                    :"get ..."
                }
        </tbody>
        </table>
        </>
    }
    return(
        <div>
            <div id="loc" style={sty}>           
                <h3>Enter coordinates for getting nearest vehicles</h3>         
                <div style={inner}>
                    <input type="number" onChange={(event)=>setCoord(event)} style={inp}name="inp" id="latitude" placeholder="Enter X coordinate"/>
                    <input type="number" onChange={(event)=>setCoord(event)} style={inp}name="inp" id="longitude" placeholder="Enter Y coordntate"/>
                </div>
                <button className="but" onClick={()=>getCars()}>Get Cars</button>
                {/* <h2>{loc.access?`Latitude: ${loc.latitude} Longitude: ${loc.longitude}` : loc.msg}</h2> */}
                {/* <button onClick={()=>getLoc()}>Location</button> */}
            </div>       
            <div style={table}>                
                    {
                        data.length?
                        tableDisplay()
                        :""
                    }                
            </div>         
        </div>
    )    
}

export default Location;