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
 

app.get('/', (req, res) => {
  res.send('Hello World new node project!')
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