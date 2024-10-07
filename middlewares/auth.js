const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const unauth = true;
  if (unauth) {
    res.status(401).send("Unauth Request");
  } else {
    next();
  }
};

module.exports = { adminAuth };
