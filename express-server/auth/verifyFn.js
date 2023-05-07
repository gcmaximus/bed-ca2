//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyFn = {
    //CHECK IF LOGGED IN
    verifyToken: function (req, res, next) {

        //retrieve the authorization header content
        const authHeader = req.headers['authorization']
        //check the authorization header content
        if (!authHeader || !authHeader.includes('Bearer')) {
            res.status(403)
            res.send({ auth: 'false', message: 'authHeader error' })
            return
        }
        else {
            //retrieve the token
            const token = authHeader.replace('Bearer ', '')

            //verify the token
            jwt.verify(token, config.key, function (err, payload) {
                if (err) {
                    res.status(403)
                    res.send({ auth: 'false', message: 'Verify failed' })
                    return
                }
                //token match
                else {
                    //store the information in request so that we can use it later (in verifyAdmin)
                    req.payload = payload
                    next()
                }
            })
        }
    },
    //verify user's identity
    verifyUser: function (req, res, next) {
        const userid = parseInt(req.params.userid)
        if (req.payload.id == userid) {
            next()
        }
        else {
            res.status(403)
            res.send({ auth: 'false', message: 'unauthorised' })
            return
        }
    },
    //verify admin's identity
    verifyAdmin: function (req, res, next) {
        if (req.payload.role == 'Admin') {
            next()
        }
        else {
            res.status(403)
            res.send({ auth: 'false', message: 'not admin' })
            return
        }
    }
}
module.exports = verifyFn