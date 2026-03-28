import { useState } from "react";
import axios from "axios";

function UploadDocument(){

const [file,setFile]=useState(null);

const submit=async()=>{

const formData = new FormData();

formData.append("application_id",1);
formData.append("document_type","passport");
formData.append("document",file);

await axios.post(
"http://localhost:5000/api/documents/upload",
formData
);

alert("Document uploaded");

}

return(

<div>

<h2>Upload Document</h2>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<br/><br/>

<button onClick={submit}>
Upload
</button>

</div>

)

}

export default UploadDocument;