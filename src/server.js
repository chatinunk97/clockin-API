const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const morgan = require("morgan");
const cors = require("cors");

//Routes
const leaveRoute = require("./routes/leave-route");

//Middlewares
const adminRoute = require("../src/routes/admin-route");
const authUserRoute = require("./routes/authUser-route");
const requestLimitMiddleware = require("./middleware/defaultMiddleware/requestLimit");
const errorMiddleware = require("../src/middleware/defaultMiddleware/error");
const notFoundMiddleware = require("../src/middleware/defaultMiddleware/not-found");
//Default Middleware
app.use(cors());
app.use(requestLimitMiddleware);
app.use(morgan("dev"));
app.use(express.json());
//////////

app.use("/leave", leaveRoute);
app.use("/admin", adminRoute);
app.use("/users", authUserRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT || 8080, () => {
  console.log(" ############ Server is running on PORT ", +PORT || 8080);
});
