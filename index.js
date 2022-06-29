//import express
const express = require('express')
//import dataservice
const dataService = require('./services/data.services')
//import
const jwt = require('jsonwebtoken')

//import cors
const cors=require('cors')

//sever app create using express
const app = express()

//cors use in server app
app.use(cors({
    origin:'http://localhost:4200'
}))
//parse JSON data
app.use(express.json())

//application specific middleware
const appMiddleware = (req, res, next) => {
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)

const jwtMiddleware = (req, res, next) => {
    try {
        token = req.headers['x-access-token']
        const data = jwt.verify(token, 'nospacesecretkey12345')
        console.log(data);
        next()
    }
    catch {
        res.status(401).json({
            status: false,
            statusCode: 401,
            message: 'please log in'

        })
    }
}

//bank server
//register API
app.post('/register', (req, res) => {
    //register solving
    dataService.register(req.body.username, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


//login API
app.post('/login', (req, res) => {
    //login solving
    dataService.login(req.body.acno, req.body.pswd)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})

//deposit API
app.post('/Deposit', jwtMiddleware, (req, res) => {
    //register solving
    dataService.Deposit(req.body.acno, req.body.password, req.body.amt)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})

//withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    //register solving
     dataService.withdraw(req.body.acno, req.body.password, req.body.amt)
     .then(result => {
        res.status(result.statusCode).json(result)
    })
})

//transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    //register solving
 dataService.getTransaction(req.body.acno)
 .then(result => {
    res.status(result.statusCode).json(result)
})
})
//user request solving
//GET request
app.get('/', (req, res) => {
    res.send("GET Request")
})

//post
app.post('/', (req, res) => {
    res.send("POST Request")
})

//put
app.put('/', (req, res) => {
    res.send("PUT Request")
})

//patch
app.patch('/', (req, res) => {
    res.send("PATCH Request")
})

//delete
app.delete('/', (req, res) => {
    res.send("DELETE Request")
})
//set up port number to the server app
app.listen(3000, () => {
    console.log("server started at 3000");
})