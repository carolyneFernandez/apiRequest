var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const {Users} = req.db;
    const username = req.query.username;
    // req.body, req.params (variables dans le path), req.get(headers)

    const users = await Users.findAll();

    let filteredUsers = users;
    if (username) {
      filteredUsers = users.filter(u => {
        return u.username === username;
      })
    }

    return res.status(200).send(filteredUsers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;