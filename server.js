const express = require("express");
const checkAuthJwt = require("./middleware/checkJwtAuth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

let listUSer = [
  {
    username: "l3azh",
    password: "naruto99",
  },
  {
    username: "hello",
    password: "123456",
  },
];

let listRefreshToken = [];

app.get("/getInformation", checkAuthJwt, (req, res) => {
  const result = listUSer.filter(
    (element) => element.username === req.user.usernames
  );
  res.status(200).json({
    message: `login with user: ${req.user.usernames}`,
    information: result,
  });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) res.status(401);
  if (!listRefreshToken.includes(refreshToken)) res.status(403);
  jwt.verify(refreshToken, process.env.RFTK_SECRET, (err, user) => {
    if (err) res.status(403);
    else {
      // tai sao khong chen luon bien user vao ma phai usernames: user.usernames
      // vi sau khi decode thi user se chua bien date, time , bla blabla ko giong nhu luc trc
      const token = jwt.sign(
        { usernames: user.usernames },
        process.env.TK_SECRET,
        { expiresIn: "1m" }
      );
      res.status(200).json({ token: token });
    }
  });
});

app.post("/login", (req, res) => {
  const user = { usernames: req.body.username };
  const token = jwt.sign(user, process.env.TK_SECRET, { expiresIn: "1m" });
  const refreshToken = jwt.sign(user, process.env.RFTK_SECRET);
  listRefreshToken.push(refreshToken);
  res.status(200).json({ token: token, refreshToken: refreshToken });
});

app.listen(port, () => console.log(`Server is listen at port ${port}`));
