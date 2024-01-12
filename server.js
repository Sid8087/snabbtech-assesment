const express = require("express");

const app = express();
const port = 5000;
const userRoute = require("./routes/userRoutes");
const User = require("./model/user");

app.use(express.json());

const mongoos = require("mongoose");
const uri =
  "mongodb+srv://siddhath8087:Pass123@user.4fpmleb.mongodb.net/?retryWrites=true&w=majority";

app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("hello w5000");
});

mongoos
  .connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Yoe are connected to the database AND server is running on the ${port}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
