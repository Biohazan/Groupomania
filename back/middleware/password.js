const passwordValidator = require('password-validator')

const schemaPassword = new passwordValidator()
    .is().min(8)                                    // Minimum length 8
    .is().max(50)                                  // Maximum length 50
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces() 

module.exports =  (req, res, next) =>{
    if (schemaPassword.validate(req.body.password)){
        next()
    } else {
        let errorPasswordArray = []
        schemaPassword.validate(req.body.password, {details : true})
        .forEach(element => {
            errorPasswordArray.push(element.message)
            console.log(errorPasswordArray)
        })
    return res.status(400).json({error: errorPasswordArray})
    }

} 
    