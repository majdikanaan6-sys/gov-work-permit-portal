function Dashboard(){

const token = localStorage.getItem("token");

return(

<div>

<h2>Employer Dashboard</h2>

<p>You are logged in.</p>

<p>Token:</p>

<textarea value={token} rows="6" cols="50" readOnly/>

</div>

)

}

export default Dashboard;