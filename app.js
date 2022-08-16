const express = require('express')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const app = express();

//Setting up the view
app.engine('ejs', ejsMate)
app.set('view engine','ejs')

//defining basic home page router
app.get('/', (req, res) => {
    res.send('Hello world!')
})

//defining basic page not found error for each routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//handling errors
app.use((err, req, res, next) => {
    //making default error message and statuscode
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Somthing went wrong!'
    //Here you can add ejs file to render and pass the error message and status code
    res.status(statusCode).send(err)
})

app.listen(3000, () => {
    console.log('Serving on port 3000!')
})