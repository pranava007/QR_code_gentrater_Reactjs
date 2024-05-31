import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Qr.css";

function Qrcode(props) {
  let [img, setimag] = useState("");  
  let [loading,setloading]=useState(false)
  let [qrdata,setqrdata] = useState("")
  let [size,setsize] = useState()


 async function gentratedQR(){

    setloading(true)
   
    try{
            let url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrdata)}`
            setimag(url);
       
    }catch(error){
        console.error(error)
    }finally{
        setloading(false)
    }  
  
}
function downloadQR(){
fetch(img).then((Response)=>Response.blob()).then((blob)=>{
  let link =document.createElement("a");
  link.href=URL.createObjectURL(blob)
  link.download="qr.png";
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
})
}
  return (
    <>
      <div className="app-container">
        <h1>QR-CODE GENERATOR</h1>
        {loading && <p>Please wait...</p>}
        {img &&   <img className="qr_code_img" src={img} alt="" srcset="" width={size} />}
        <label htmlFor="dataInput" className="input-lable">
          Data for QR code:
        </label>
        <input type="text" id="dataInput" onChange={(e)=>setqrdata(e.target.value)}/>

        <label htmlFor="sizeInput" className="input-lable">
          Image size (e.g., 150) :
        </label>
        <input type="text" id="sizeInput" onChange={(e)=>setsize(e.target.value)} />
        <dir>
          <button className="gen" onClick={gentratedQR} disabled={loading} >Generate QR Code</button>
          <button className="don" onClick={downloadQR}>Download QR Code</button>
        </dir>
      </div>
    </>
  );
}

Qrcode.propTypes = {};

export default Qrcode;
