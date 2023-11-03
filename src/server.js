const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const morgan = require("morgan");
const cors = require("cors");

//Routes
const leaveRoute = require("./routes/leave-route");
const userRoute = require("./routes/user-route");
const clockRoute = require("./routes/clock-route");
const OTRoute = require("./routes/OT-route");
const timeRoute = require("./routes/time-route");
const flexibleRoute = require("./routes/flexible-route");

//Middlewares
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
app.use("/user", userRoute);
app.use("/clock", clockRoute);
app.use("/OT", OTRoute);
app.use("/time", timeRoute);
app.use("/flexible", flexibleRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT || 8080, () => {
  console.log(" ############ Server is running on PORT ", +PORT || 8080);
});
