const Joi = require('joi')

//Creating a campground schema with Joi object
module.exports.userSchema = Joi.object({
    //defining campground as an object
    user: Joi.object({
        //setting up the fields as required and appropriate data type
        username: Joi.string().min(4).required(),
        email: Joi.string().required(),
        password: Joi.string().min(5).required(),
    }).required()
})