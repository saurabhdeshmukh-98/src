const express = require("express");
const app = express();
const cors = require("cors");
const {sequelize} =require('./dataBase/db')
const bodyParser = require("body-parser");
require("dotenv").config();

const router = require("./router/router");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router);

sequelize.sync({
  alter:true
})

app.listen(process.env.PORT, () => {
  sequelize.authenticate()
  console.log('connected to the database')
  console.log(`server is running on port number:${process.env.PORT}`);
});
