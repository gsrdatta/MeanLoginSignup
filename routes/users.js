const mongoose = require('mongoose');
const router = require('express').Router();
const Users = mongoose.model('Users');

router.post('/', (req, res, next) => {
    try {
        req.body.createdDate = new Date();
        const user = req.body;
        if (!user.name) {
            return res.status(422).json({
                errors: {
                    message: 'Name is required',
                },
            });
        }

        if (!user.username) {
            return res.status(422).json({
                errors: {
                    message: 'Username is required',
                },
            });
        }

        if (!user.email) {
            return res.status(422).json({
                errors: {
                    message: 'Email is required',
                },
            });
        }

        if (!validateEmail(user.email)) {
            return res.status(422).json({
                errors: {
                    message: 'Plese enter a Valid Email Address',
                },
            });
        }

        if (!user.phone) {
            return res.status(422).json({
                errors: {
                    message: 'Phone is required',
                },
            });
        }
        if (!user.address1) {
            return res.status(422).json({
                errors: {
                    message: 'Address is required',
                },
            });
        }
        user.email = user.email.toLowerCase();
        Users.find({ "username": user.username }, (err, doc) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        error: err,
                        message: 'Some Error Occured',
                    },
                });
            } else {
                if (doc.length > 0) {
                    return res.status(400).json({
                        errors: {
                            message: 'Username Already Exists',
                        },
                    });
                } else {
                    let finalUser = new Users(user);
                    finalUser.setPassword(user.password)
                    finalUser.save().then(() => {
                        return res.json({ message: "User Signup successful" })
                    });
                }
            }
        })
    } catch (err) {
        return res.status(400).json({
            errors: {
                error: err,
                message: 'Some Error Occured',
            },
        });
    }
});

router.post('/login', auth.optional, (req, res, next) => {
    try {
        const user = req.body;
        if (!user.email) {
            return res.status(422).json({
                errors: {
                    message: 'Email is required'
                },
            });
        }


        if (!user.password) {
            return res.status(422).json({
                errors: {
                    message: 'Password is required'
                },
            });
        }
        Users.find({ email: user.email }, (err, user) => {
            if (user.length > 0) {
                let finalUser = new Users(user[0]);
                if (finalUser.validatePassword(user.password)) {
                    const user = finalUser;
                    user.token = finalUser.generateJWT();
                    return res.json({ user: user.toAuthJSON() });
                } else {
                    return res.status(422).json({
                        errors: {
                            message: 'Invalid Email or Password'
                        },
                    });
                }
            } else {
                return res.status(422).json({
                    errors: {
                        message: 'Invalid Email or Password'
                    },
                });
            }
        })
    } catch (err) {
        logger.error("error in login");
        return res.status(400).json({
            errors: {
                message: 'Some Error Occured',
            },
        });
    }
});

function validateEmail(email) {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase())
}

module.exports = router;