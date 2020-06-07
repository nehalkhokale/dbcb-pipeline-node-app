
// const {db, user} = require('../models')

const db = require('../database/connect')
const User = db.users
const bcrypt = require('bcryptjs')
const constants = require('../constants/constants')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const assert = require('assert')
const Token =db.token

handle403Error = (err, req, res, next) => {
  res.status(constants.HTTP_401).json({ 'error': true, 'success': false, 'message': err.message })
}
handle401Error = (err, req, res, next) => {
  res.status(constants.HTTP_401).json({ 'error': true, 'success': false, 'message': err.message })
}

// Add a user
module.exports.addUser = (req, res) => {
  try {
    var user = req.body;
    console.log('--user', user);
    User.create(user).then(newUser => {
      res.json({ error: false, success: true, message: "user added", data: newUser })
    }).catch(err => {
      res.json({ error: true, success: false, message: err, data: [] })
    });
  } catch (e) {
    console.log('e', e);
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

// get all active users
module.exports.getUsers = async (req, res) => {
  try {

    
    User.findAll({ where: { isActive: 1 } }).then((userDoc) => {
      res.json({ error: false, success: true, message: "Active users", data: userDoc })
    }).catch(error => {
      res.json({ error: true, success: false, message: e, data: [] })
    });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

//find active user by id 
module.exports.getUserById = async (req, res) => {
  try {
    let id = req.params.id
    console.log('id', id);
    User.findOne({ where: { 'userId': id, 'isActive': 1 } ,attributes: ['email']}).then(function (getUser) {
      res.json({ error: false, success: true, message: "Active users", data: getUser })
    }).catch(error => {
      res.json({ error: true, success: false, message: e, data: [] })
    });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

// Update a category and return updated object
module.exports.updateUserById = async (req, res) => {
  try {
    let id = req.params.id
    var user = req.body;
    let key = Object.keys(user);
    console.log('--keyValue',key);
    
    // user.UpdatedBy = data.userId;
    user.UpdatedOn = Date.now();

    User.update(user, {
      returning: true,
      where: {
        userId: id,
        isActive: 1
      },
      plain: true
    }).then((updateUser) => {
      User.findOne({ where: { 'userId': id, 'isActive': 1 }, attributes: key}).then(function (getUser) {
        res.json({ error: false, success: true, message: "User updated", data: getUser })
      })
    }).catch(error => {
      res.json({ error: true, success: false, message: error, data: [] })
    });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

// Update a category and return updated object
module.exports.updateUser = async (req, res) => {
  try {
    let _filter = req.query.filter
    let _paramsContractTemplate = {}

    if (_filter) {
      _paramsContractTemplate = JSON.parse(_filter)
    }
    var user = req.body;
    user.UpdatedBy = user.userId;
    user.UpdatedOn = Date.now();
    // _paramsContractTemplate.isActive=1
    User.update(user, {
      where: _paramsContractTemplate,
      returning: true,
    }).then((updateUser) => {
      console.log('--updateUser', _paramsContractTemplate, updateUser);

      User.findAll({ where: _paramsContractTemplate }).then(function (getUser) {
        res.json({ error: false, success: true, message: "Updated users", data: getUser })
      })
    }).catch(error => {
        console.log('--error', error);

        res.json({ error: true, success: false, message: error, data: [] })
      });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

//delete one user
module.exports.deleteUserById = async (req, res) => {
  try {
    let id = req.params.id;
    var user = {}
    user.isActive = 0
    user.UpdatedBy = user.userId;
    user.UpdatedOn = Date.now();
    // _paramsContractTemplate.isActive=1
    User.update(user, {
      where: { 'userId': id },
    }).then((updateUser) => {
      console.log('--updateUser', updateUser);

      User.findOne({ where: { 'userId': id } }).then(function (getUser) {
        res.json({ error: false, success: true, message: "Updated users", data: getUser })
      })
    }).catch(error => {
        console.log('--error', error);

        res.json({ error: true, success: false, message: error, data: [] })
      });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}
// Delete a category and return updated object
module.exports.deleteUsers = async (req, res) => {
  try {
    let _filter = req.query.filter
    let _paramsContractTemplate = {}

    if (_filter) {
      _paramsContractTemplate = JSON.parse(_filter)
    }
    var user = {}
    user.isActive = 0
    user.UpdatedBy = user.userId;
    user.UpdatedOn = Date.now();
    // _paramsContractTemplate.isActive=1
    User.update(user, {
      where: _paramsContractTemplate,
      returning: true,
    }).then((updateUser) => {
      console.log('--updateUser', _paramsContractTemplate, updateUser);

      User.findAll({ where: _paramsContractTemplate }).then(function (getUser) {
        res.json({ error: false, success: true, message: "Updated users", data: getUser })
      })
    }).catch(error => {
        console.log('--error', error);

        res.json({ error: true, success: false, message: error, data: [] })
      });

  } catch (e) {
    console.log('e', e)
    res.json({ error: true, success: false, message: e, data: [] })
  }
}

module.exports.register = (req, res, next) => {
  try {
    let hashedPassword = bcrypt.hashSync(req.body.password, 8)
  let _User = req.body
  _User.hash = hashedPassword
  console.log('--_User.password === _User.confirmPassword',_User.password, _User.confirmPassword);
  
  if (_User.password === _User.confirmPassword){
    User.create(_User).then(newUser => {
      res.json({ error: false, success: true, message: "user added", data: newUser })
    }).catch(err => {
      res.json({ error: true, success: false, message: err, data: [] })
    });
  }else{
      res.json({error: true , success: false , message:'Confirm password does not match the password feild'})
  }
  } catch (error) {
    console.log('e', error)
    res.json({ error: true,success: false,message: error, data: []})
  }
}


exports.login = (req, res, next) => {
  let body = req.body
  console.log('--body',body);
  
  User.findOne({ where: {'email':body.email} }).then(function (getUser) {
    let data = getUser.dataValues
    if (data != null) {
          let passwordIsValid = bcrypt.compareSync(req.body.password, data.hash)
          if (passwordIsValid) {
              let buff = new Buffer(config.token.secret)
              let base64data = buff.toString('base64')
              let token = jwt.sign({ id: data.email }, base64data, {
                  // expiresIn: '24h'
                  expiresIn: config.token.validity, // expires in 24 hours
              })
              try {
                  req.session.login(req, data, (err) => {
                      if (err) return handleError(err, req, res, next)
                  })
              } catch (error) {
                  return handleError(error, req, res, next)
              }

              req.session.token = token
              let userDetail = JSON.parse(JSON.stringify(data))
              userDetail.token ='Bearer ' + token
              delete userDetail.hash
              res.json({
                  success: true,
                  message: 'Authentication successful!',
                  data:userDetail ,
                  // token: 'Bearer ' + token
              });
              let createdAt = Date.now()
             
              Token.upsert({ token: token, createdAt: createdAt , email:body.email }, {
                returning: true,
                where: {
                  email: req.body.email 
                },
                plain: true
              }).then((updateUser) => {
                  // console.log(' in token doc',doc);

              })
          } else {
              // req.session.token = token
              // console.log('--------after',req.session);

              return res.json({
                  error: true,
                  success: false,
                  message: 'Please check whether you have entered valid password ',
                  data: []
              })
          }
      }
      else {
          res.json({
              error: true,
              success: false,
              message: 'Please check whether you have entered valid email',
              data: []
          });
      }
  }).catch((err)=>{
    console.log('--err',err);
    
    res.json({ error: true, success: false, message: err.message, data: [] })
  })
}

module.exports.verifyToken = (req, res, next) => {
  //  get the token from the request
  let Bearer = null
  if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer
  //  if token exists, verify the same
  // also verify token from session data
  let user = null
  if (token) {
      let buff = new Buffer(config.token.secret)
      let base64data = buff.toString('base64')
      jwt.verify(token, base64data, function (err, decoded) {
          if (err) {
              // console.log('----err', err)
              return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
          }
          req.decoded = decoded
          user = decoded.id
          req.isAuthenticated = true
          //  res.status(constants.HTTP_200).json({'error': false, 'message': constants.VALID_TOKEN})
      })
      //  let dbToken = null
      let q = { email: user }
      User.findOne({where:q}).then((data)=>{
        var willGetAUser = data.dataValues
              req.session.userInfo = willGetAUser
              // req.session.user = req.session.userInfo.email
              Token.findOne({where:q}).then((data)=>{
                var willGetAToken = data.dataValues
                        if (!willGetAToken) return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                        if (willGetAToken.token !== token) return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                        //send session
                        let resData = req.session
                        next()
                        // res.json({error: false, success: true, message: '', data: resData})
                    }).catch((err) => {
                        console.log(err)
                        return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
                    })
              })
      
  } else {
      return handle401Error({ 'message': constants.INVALID_SESSION }, req, res, next)
  }
}
// authorize the user 
module.exports.me = (req, res, next) => {
    
  let Bearer = null
  if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer

  console.log('--00 req.session', req.session.user,req.session)
  let _email = null
  if(req.session.userInfo.email) {
      // req.session.user = req.session.userInfo.email
      _email = req.session.userInfo.email.toLowerCase()
  } else {
      return handle403Error({ 'message': constants.INVALID_SESSION }, req, res, next)
  }
  console.log('==-11 req.session again', req.session)
  // console.log('--- 1_email', _email)
  let dbToken = null
  Token.findOne({ where:{ email: _email }}).then((data)=>{
    let willGetAToken = data.dataValues
    
      // console.log('--1 doc', doc)
      dbToken = willGetAToken.token
      if ((null === dbToken) || (!dbToken === token)) return handle403Error({ 'message': constants.INVALID_TOKEN }, req, res, next)
      let resData = req.session
      // user info here
      // console.log(resData)
      // console.log(_email)
      // console.log('1 --token', token)
      console.log('1-- dbToken', dbToken)
      if(dbToken === token){

          res.json({ error: false, success: true, message:'valid token', data: [] })
      } else {
          res.json({ error: true, success: false, message:'invalid token', data: [] })
      }
      // User.findOne({ 'email': _email }).exec()
      //     .then((doc) => {
      //         console.log(_email, doc)
      //         resData.userInfo = doc
      //         res.json({ error: false, success: true, message: `namaste ${doc.email}`, data: resData })
      //     })
      //     .catch((err) => handleError(err, req, res, next))
  }).catch((err) => {
    return handle403Error({ 'message': constants.INVALID_TOKEN }, req, res, next)
})
  
}