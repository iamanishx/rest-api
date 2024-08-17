const express = require('express');
const users = require('./MOCK_DATA.json')
const app = express();
const PORT = 8000;
const fs = require('fs');
const mongoose = require('mongoose');
const { type } = require('os');
const { stringify } = require('querystring');


const userSchema = new mongoose.Schema({
 firstName: {
    type: String,
    required:true,
 },
 lastName:{
    type: String,
 },
 email: {
    type:String,
    required: true,
    unique: true,
 },
 jobTitle:{
    type:String,
 },
 gender:{
    type:String,
 },
});
const User = mongoose.model('user', userSchema)

mongoose
.connect("mongodb://localhost:27017/rest-api")
.then(()=> console.log("mongoDB connected"))
.catch(err=> console.log("Mongo error", err));

app.use(express.urlencoded({ extended: false }));



app.use((req, res, next) => {
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.ip} ${req.method}:${req.path}\n`,
        (err, data) => {
            next();
        }
    );
});

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>    
    `;
    res.send(html);
});



app.get("/api/users", (req, res) => {
    return res.json(users);
});


app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res) => {
        return res.json({ status: "pending" });
    })
    .delete((req, res) => {
        return res.json({ status: "pending" });
    });

app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", id: users.length + 1 });
    })
    console.log("Body", body)

});

app.listen(PORT, () => console.log(`server started at port :${PORT}`))
