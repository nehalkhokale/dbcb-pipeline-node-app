const express = require('express')
const router = new express.Router()
const constants = require('../constants/constants')
const User = require('../controllers/User')

router.post('/createuser', User.register);
router.post('/login', User.login);
router.use(User.verifyToken)
router.get('/auth/me', User.me)
router.get('/getusers', User.getUsers);
router.get('/getuserbyid/:id', User.getUserById);
router.put('/updateuserbyid/:id', User.updateUserById);
router.put('/updateuser', User.updateUser);
router.delete('/deleteuser/:id', User.deleteUserById);
router.delete('/deleteusers', User.deleteUsers);

module.exports = router
