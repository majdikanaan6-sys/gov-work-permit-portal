import { useState } from "react";
import axios from "axios";

function Login(){

const [form,setForm]=useState({});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const submit=async()=>{

try{

await axios.post(
"https://gov-work-permit-portal-production.up.railway.app/api/auth/register",
form
);

const token = res.data.token;

localStorage.setItem("token", token);

alert("Login successful");

window.location.href="/dashboard";

}catch(err){

alert("Invalid email or password");

}

}

return(

<div>

<h2>Employer Login</h2>

<input name="email" placeholder="Email" onChange={handleChange}/>
<br/><br/>

<input name="password" type="password" placeholder="Password" onChange={handleChange}/>
<br/><br/>

<button onClick={submit}>Login</button>

</div>

)

}

export default Login;