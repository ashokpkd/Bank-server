//import
const jwt = require('jsonwebtoken')
//import db
const db = require('./db')

//database
// db = {
//   1000: { "acno": 1000, "username": "luffy", "password": 1000, "balance": 1000, transaction: [] },
//   1001: { "acno": 1001, "username": "zoro", "password": 1001, "balance": 1000, transaction: [] },
//   1002: { "acno": 1002, "username": "sanji", "password": 1002, "balance": 1000, transaction: [] }
// }

//register
const register = (username, acno, password) => {
  return db.User.findOne({
    acno
  }).then(user => {
    console.log(user);
    if (user) {
      return {
        status: false,
        message: "already registered...please log in",
        statusCode: 401
      }
    }
    else {
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        message: "registerd successfully",
        statusCode: 200
      }
    }
  })

}

//login
const login = (acno, pswd) => {

  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      console.log(user);
      currentUser = user.username
      currentAcno = acno
      //token generation
      token = jwt.sign({
        currentAcno: acno
      }, 'nospacesecretkey12345')
      return {
        status: true,
        message: "login successful",
        statusCode: 200,
        currentAcno,
        currentUser,
        token
      }

    }
    else {
      return {
        status: false,
        message: "invalid Account number or Password",
        statusCode: 401
      }
    }
  })

}

//deposit
const Deposit = (req, acno, password, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (user) {
      if (acno != req.currentAcno) {
        return {
          status: false,
          message: "access denied !!",
          statusCode: 401
        }
      }
      user.balance += amount
      user.transaction.push({
        type: "CREDIT",
        amount: amount
      })
      user.save()
      return {
        status: true,
        message: amount + "deposited successfully..new balance is" + user.balance,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "invalid Account number or Password",
        statusCode: 401
      }
    }
  })

}

//withdraw
const withdraw = (req, acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno, password
  }).then(user => {
    if (user) {
      if (acno != req.currentAcno) {
        return {
          status: false,
          message: "access denied !!",
          statusCode: 401
        }
      }
      if (user.balance > amount) {
        user.balance -= amount
        user.transaction.push({
          type: "DEBIT",
          amount: amount
        })
        user.save()
        return {
          status: true,
          message: amount + "debited successfully..new balance is" + user.balance,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 401
        }
      }
    }
    else {
      return {
        status: false,
        message: "invalid Account number or Password",
        statusCode: 401
      }
    }
  })


}



//transaction
const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
      }
    }
    else {
      return {
        status: false,
        message: "user doesnot exist",
        statusCode: 401
      }
    }
  })
}

//delete
const deleteAcc = (acno) => {
  return db.User.deleteOne({
    acno
  }).then(user => {
    if (!user) {
      return {
        status: false,
        message: "operation failed",
        statusCode: 401
      }
    }

    return {
      status: true,
      message: "successfully deleted",
      statusCode: 200
    }
  })
}


module.exports = {
  register,
  login,
  Deposit,
  withdraw,
  getTransaction,
  deleteAcc
}