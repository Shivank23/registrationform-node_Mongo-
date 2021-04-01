const express = require("express");
const path = require("path");
const hbs = require('hbs');
const Register = require("./models/registers")
const app = express();
require("./db/conn");
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public")
const template_Path = path.join(__dirname, "../templates/views")
const partials_Path = path.join(__dirname, "../templates/partials")
app.use(express.static(staticPath));
app.set("views", template_Path);
//register partials
hbs.registerPartials(partials_Path);
//setting view engine
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.get("/", (req, res) => {
    res.render("index")
});
app.get("/register", (req, res) => {
    res.render("register")
});
app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registrationEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,
            })
            const registered = await registrationEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("Password not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})
//LOGIN VALIDATION
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email })
        if (useremail.password === password) {
            res.status(201).render('index')
        } else {
            res.send("password not matched")
        };


    } catch (error) {
        res.status(400).send("invalid Email");
    }
});
app.listen(port, () => {
    console.log(`listening to the port number ${port}`)
})