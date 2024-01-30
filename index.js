const express = require("express")
const mysql = require("mysql2");
const app = express()
const port = 3000


app.use(express.json());

const con = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "7788",
    database: "ems-nodejs"
})
con.connect(function(err) {
    if(err) {
        console.log(err)
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})
 
//test
app.get('/', (req, res) => {
  res.send('Hello World new node project!')
})

//filter by id

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

//delete
app.delete("/delete/:id",(req,res)=>{
    const id=req.params.id;
    const sql="DELETE from employee WHERE id = ?"

    con.query(sql,[id],(err,result)=>{
        if(err) return res.json({Error: "Delete Error!!"})
        return res.json({Status: "Deleted Successfully!"})

    })

})




//update
app.put("/update/:id",(req,res)=>{
    const userId=req.params.id;
    const sql="UPDATE employee SET `name`=?, `address`=?, `contact`=? WHERE id=?";

    const values=[
        req.body.name,
        req.body.address,
        req.body.contact
    ];

    con.query(sql,[...values,userId], (err,data)=>{
        if(err) return res.send(err);
        return res.json(data);
    })

    })



//Get Employees

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Result: result})
    })
})

//Enroll Employees
app.post('/create',(req,res)=>{
    const name = req.body.name;
    const address = req.body.address;
    const contact = req.body.contact;

    con.query("INSERT INTO `ems-nodejs`.employee (name, address, contact) VALUES (?, ?, ?)", [name, address, contact], 
    (err, result) => {
        if(result){
            res.send(result);
            console.log(result)
        }else{
            res.send({message: "ENTER CORRECT DETAILS!"})
        }
    }
)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})