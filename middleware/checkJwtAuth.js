const jwt = require("jsonwebtoken");

const checkAuthJwt = (req, res, next) => {
  const authBearerString = req.headers.authorization;
  console.log(authBearerString);
  console.log(authBearerString.split(" ")[0]);
  if (authBearerString && authBearerString.split(" ")[0] === "Bearer") {
    const token = authBearerString.split(" ")[1];
    jwt.verify(token, process.env.TK_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Access denied" });
  }
};

module.exports = checkAuthJwt;
