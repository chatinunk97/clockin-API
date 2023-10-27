const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const morgan = require("morgan");
const cors = require('cors')

//Routes

//Middlewares
const requestLimitMiddleware = require('./middleware/defaultMiddleware/requestLimit')

//Default Middleware
app.use(cors())
app.use(requestLimitMiddleware)
app.use(morgan("dev"));
app.use(express.json());
//////////



app.listen(PORT, () => {
  console.log(" ############ Server is running on PORT ", +PORT);
});
