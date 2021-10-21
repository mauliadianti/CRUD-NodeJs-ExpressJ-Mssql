const {db} = require('../mssql/queries.js')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const {img,setupImg} = require('./foto.js')

function Token(req){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(process.env.TOKEN === token) return 1
  else return 0
}


class user{
  async createUser (req,res){
    try{
      if(Token(req)){
          const user_id = crypto.randomBytes(15).toString('hex') 
            const transporter = nodemailer.createTransport({
              service: 'gmail', 
              secure: true, 
              auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
              }
            }); 
            let otp = Math.floor(1000 + Math.random() * 9000); 
            
            const mailDdetails = {
              from: process.env.EMAIL_USER, 
              to: req.body.email, 
              subject: 'Email Verification', 
              text: `Verify your email address by entering this code: ${otp} don't give this secure code to anyone else`
            }; 
            
            transporter.sendMail(mailDdetails, function(err, data){
              if(err){
                console.log(`error send email to ${req.body.email}`, err); 
              }else{
                console.log(`email sent to ${req.body.email}`); 
              }
            });
          const result = await db.request()
            .input(`function`, 3)
            .input(`email`, req.body.email)
            .input(`user_id`, user_id)
            .input(`usr_password`, req.body.usr_password)
            .input(`nama`, req.body.nama)
            .input(`alamat`, req.body.alamat)
            .input(`kecamatan`, req.body.kecamatan)
            .input(`kota`, req.body.kota)
            .input(`no_hp`, req.body.no_hp)
            .input(`ttl`, req.body.ttl)
            .input(`jenis_kelamin`, req.body.jenis_kelamin)
            .input(`otp`, otp)
            .execute(`[dbo].[Sp.Users]`);
          if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
          else{res.send({error: result.recordset[0]})}
        }
        else{
        res.send({error: 'Wrong Token'})
      }
    }
    catch(err){
      res.send({error: 'Server Error' + err})    
    }
  }

  async otpVerification (req, res){
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 16)
          .input(`user_id`, req.params.user_id)
          .input(`otp`, req.body.otp)
          .execute(`[dbo].[Sp.Users]`)
          if(result.recordset[0]['error']) res.send({message: result.recordset})
        else{res.send({error: result.recordset[0]})}
      }else {
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }


  async getAllUser (req, res){
    try{
      if(Token(req)){
        await db.connect(); 
        const result = await db.request()
          .input(`function`, 1)
          .execute(`[dbo].[Sp.Users]`);
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})    
    }
  }

  async getUsers (req, res){
    try{
      if(Token(req)){
        await db.connect(); 
        const result = await db.request()
          .input(`function`, 2)
          .input(`email`, req.params.email)
          .execute(`[dbo].[Sp.Users]`);
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})    
    }
  }

  async loginUser (req, res){
    try{
      if(Token(req)){
        await db.connect(); 
        const result = await db.request()
          .input(`function`, 4)
          .input(`email`, req.body.email)
          .input(`usr_password`, req.body.usr_password)
          .execute(`[dbo].[Sp.Users]`)
          if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
          else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }      
    }catch(err){
      res.send({error: 'Server Error' + err})    
    }
  }


  async deleteUser (req, res){
    try{
      if(Token(req)){
        await db.connect();
        const result = await db.request()
          .input(`function`, 5)
          .input(`user_id`, req.params.user_id)
          .execute(`[dbo].[Sp.Users]`)
        if(result.recordsets.length === 0) res.send({message: 'OK'})
        else res.send({error: result.recordset[0]})  
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async updateUsers (req,res){
    try{
      if(Token(req)){
        await db.connect();
        if(req.body.nama){
            const result = await db.request()
              .input(`function`, 5)
              .input('user_id', req.params.user_id)
              .input('nama', req.body.nama)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.no_hp){
            const result = await db.request()
              .input(`function`, 6)
              .input('user_id', req.params.user_id)
              .input('no_hp', req.body.no_hp)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]}) 
        }else if(req.body.ttl){
            const result = await db.request()
              .input(`function`, 7)
              .input('user_id', req.params.user_id)
              .input('ttl', req.body.ttl)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.alamat){
            const result = await db.request()
              .input(`function`, 8)
              .input('user_id', req.params.user_id)
              .input('alamat', req.body.alamat)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.kecamatan){
            const result = await db.request()
              .input(`function`, 9)
              .input('user_id', req.params.user_id)
              .input('kecamatan', req.body.kecamatan)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.kota){
            const result = await db.request()
              .input(`function`, 10)
              .input('user_id', req.params.user_id)
              .input('kota', req.body.kota)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.jenis_kelamin){
            const result = await db.request()
              .input(`function`, 11)
              .input('user_id', req.params.user_id)
              .input('jenis_kelamin', req.body.jenis_kelamin)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})
        }else if(req.body.new_pwd){
            const result = await db.request()
              .input(`function`, 15)
              .input(`user_id`, req.params.user_id)
              .input(`usr_password`, req.body.usr_password)
              .input(`new_pwd`, req.body.new_pwd)
              .execute(`[dbo].[Sp.Users]`)
            if (result.recordsets.length === 0 ) res.send({message: 'OK'})
            else{res.send({error: result.recordset[0]})}
        }else{
          res.send("wrong update")
        }
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'server error '+ err})
    }
  }

  photo(req,res){
    try{
      if(Token(req)){        
        img(req, res, async err => {
          if (err instanceof setupImg.MulterError) res.send({error: err})
          else {
            if(!req.file){
              res.send({error: "file extension anda salah"})
              return
            }
            const result = await db.request()
              .input(`function`, 12)
              .input('user_id', req.params.user_id)
              .input('foto', req.file.path)
              .execute(`[dbo].[Sp.Users]`);
            if (result.recordsets.length === 0 )res.send({message: 'OK'})
            else res.send({error: result.recordset[0]})              
          }
        })        
      }else{
        res.send({error: 'Wrong Token'})
      }  }
    catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async accountInfo(req, res) {
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 13)
          .input(`user_id`, req.params.user_id)
          .execute(`[dbo].[Sp.Users]`);
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'server error: ' + err})
    }
  }

  async accountProfile (req, res) {
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 14)
          .input(`user_id`, req.params.user_id)
          .execute(`[dbo].[Sp.Users]`); 
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        // const data = result.recordsets 
      // console.log(data);}
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Eerror: '+ err})
    }
  }

  async changePassword (req, res){
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 15)
          .input(`user_id`, req.params.user_id)
          .input(`usr_password`, req.body.usr_password)
          .input(`new_pwd`, req.body.new_pwd)
          .execute(`[dbo].[Sp.Users]`)
        if(result.recordsets.length === 0 ) res.send({message: 'OK'})
        else{res.send({error: result.recordset[0]})}
      }else {
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'server error: '+err})
    }
  }

  async emailCheck (req, res){
    try{
      if(Token(req)){
        const transporter = nodemailer.createTransport({
          service: 'gmail', 
          secure: true, 
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
          }
        }); 
        let otp = Math.floor(1000 + Math.random() * 9000); 
        
        const mailDdetails = {
          from: process.env.EMAIL_USER, 
          to: req.body.email, 
          subject: 'RESET Password', 
          text: `For reset password, please verify your email address by entering this code: ${otp} don't give this code to anyone else`
        }; 
        
        transporter.sendMail(mailDdetails, function(err, data){
          if(err){
            console.log(`error send email to ${req.body.email}`, err); 
          }else{
            console.log(`email sent to ${req.body.email}`); 
          }
        });
        const result = await db.request()
          .input(`function`, 18)
          .input(`email`, req.body.email)
          .input(`otp`, otp)
          .execute(`[dbo].[Sp.Users]`)
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        else{res.send({error: result.recordset[0]})}
      }
      else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async otpForgetPwdCheck(req, res){
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 19)
          .input(`user_id`, req.params.user_id)
          .input(`otp`, req.body.otp)
          .execute(`[dbo].[Sp.Users]`)
        if(!result.recordset[0]['error']) res.send({message: result.recordset[0]})
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async forgetPwd (req, res){
    try{
      if(Token(req)){
        const result = await db.request()
          .input(`function`, 20)
          .input(`user_id`, req.params.user_id)
          .input(`usr_password`, req.body.usr_password)
          .execute(`[dbo].[Sp.Users]`)
        if(result.recordsets.length === 0 ) res.send({message: 'OK'})
        else{res.send({error: result.recordset[0]})}
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

}

module.exports = user