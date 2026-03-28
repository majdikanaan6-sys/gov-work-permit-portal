import { useState } from "react";
import axios from "axios";

function Register() {

const [form,setForm]=useState({});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const submit=async()=>{

await axios.post(
"http://localhost:5000/api/auth/register",
form
)

alert("Registration successful")

}

return(

<div>

<h2>Employer Registration</h2>

<input name="company_name" placeholder="Company Name" onChange={handleChange}/>
<input name="registration_number" placeholder="Registration Number" onChange={handleChange}/>
<input name="email" placeholder="Email" onChange={handleChange}/>
<input name="password" type="password" placeholder="Password" onChange={handleChange}/>

<button onClick={submit}>Register</button>

</div>

)

}

export default Register;