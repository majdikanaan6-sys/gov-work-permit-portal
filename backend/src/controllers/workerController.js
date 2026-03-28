const workerModel = require("../models/workerModel");

exports.registerWorker = async (req,res)=>{

try{

const worker = await workerModel.createWorker(req.body);

res.status(201).json({
message:"Worker registered",
worker
});

}catch(error){
     console.error(error);

res.status(500).json({error:error.message});

}

};


exports.getApplicationByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      "SELECT * FROM work_permit_applications WHERE email = $1",
      [email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};