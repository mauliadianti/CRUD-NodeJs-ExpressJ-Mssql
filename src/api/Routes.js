const express = require('express')
const user = require('./Users.js')


const router = express.Router()
const Users = new user()

const routes = (app) =>{
  router.get('/get_usr/:user_id', Users.getUsers)
  router.post('/usr_register', Users.createUser)
  router.post('/usr_login', Users.loginUser)
  router.put('/usr_update/:user_id', Users.updateUsers)
  router.put('/usr_update/photo/:user_id', Users.photo) 
  router.get('/usr_Info/:user_id', Users.accountInfo)
  router.get('/usr_Profile/:user_id', Users.accountProfile)
  router.put('/usr_otpRegister/:user_id', Users.otpVerification)
  router.put('/usr_changePassword/:user_id', Users.changePassword)
  router.delete(`/usr_delete/:user_id`, Users.deleteUser)
  router.post(`/usr_checkEmail`, Users.emailCheck)
  router.post(`/usr_otpForgetPwd/:user_id`, Users.otpForgetPwdCheck)
  router.put(`/usr_forgetPwd/:user_id`, Users.forgetPwd)

  app.use('/api', router)
}

module.exports = routes