const express = require('express')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const mongoose = require('mongoose')
const UserSchema = require('./models/user')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {userSchema} = require('./schemas')

//Database setup
mongoose.connect('mongodb://localhost:27017/user', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Connecting the databse if not any errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

//Setting up the view
app.engine('ejs', ejsMate)
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

//creating a function to assign errors
const validateUser = (req, res, next) => {
    //desrtucturing the error message that we get after validation
    const {error} = userSchema.validate(req.body);
    if(error){
        //mapping that error message
        const msg = error.details.map(el => el.message).join(',')
        //throwing that error using the custom error class
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//defining basic home page router
app.get('/', catchAsync(async(req,res) => {
    const users = await UserSchema.find()
    res.render('index', {users})
}))

app.get('/form', (req, res) => {
    res.render('form')
})

app.post('/',validateUser, catchAsync(async(req, res, next) => {
    const user = new UserSchema(req.body.user);
    await user.save();
    res.redirect(`/`)
}))

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
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000!')
})