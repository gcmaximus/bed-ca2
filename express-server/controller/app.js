//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const express = require('express')
const app = express()

const User = require('../models/User')
const Airport = require('../models/Airport')
const Booking = require('../models/Booking')
const Flight = require('../models/Flight')
const Promotion = require('../models/Promotion')
const verifyFn = require('../auth/verifyFn')


//import middleware
const bodyParser = require('body-parser')
const cors = require('cors')

//use the middleware
app.use(bodyParser.json())
app.options('*', cors());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

/* user endpoints */

//Login
app.post('/user/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.loginUser(email, password, function (err, token, result) {
        if (!err) {
            res.status(200)
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password']
            res.json({
                success: true,
                UserData: JSON.stringify(result),
                token: token,
                status: 'Logged in!'
            });
            res.send();
        } else {
            res.status(500);
            res.sendStatus(err.statusCode);
        }
    });
});

//Logout
app.post('/user/logout', function (req, res) {
    console.log("Logging out...");
    res.json({
        success: true,
        status: 'Logged out!'
    });

});

//GET role from decoded token
app.get('/role', verifyFn.verifyToken, (req, res) => {
    if (req.payload.role == 'Admin') {
        res.json({ isAdmin: true, status: 'Admin check success' })
    }
    else {
        res.json({ isAdmin: false, status: 'Admin check failure' })
    }

})


// POST webservice to add new user to database
app.post('/users/', (req, res) => {
    User.addUser(req.body, (err, userid) => {
        if (err) {
            //The new username OR new email provided already exists
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(err.code)
                res.status(422).send('The username or email provided already exists')
                return
            }
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(201).send({ userid })

    })
})
// GET webservice to retrieve all users' data
app.get('/users/', (req, res) => {
    User.getUsers((err, users) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200).send(users)
    })
})


// GET webservice to retrieve a user's data by id
// USER VERIFICATION REQUIRED
app.get('/users/:userid/', verifyFn.verifyToken, verifyFn.verifyUser, (req, res) => {
    const userID = req.params.userid

    User.getUserByID(userID, (err, user) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200).send(user)
    })
})


// PUT webservice to update a user's data
// USER VERIFICATION REQUIRED
app.put('/users/:userid/', verifyFn.verifyToken, verifyFn.verifyUser, (req, res) => {
    const userID = req.params.userid

    User.updateUser(userID, req.body, (err, result) => {
        if (err) {
            //The new username OR new email provided already exists
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(err.code)
                res.status(422).send('The username or email provided already exists')
                return
            }

            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200)
        res.json({ success: true, result: result, status: 'Record updated successfully!' });
    })
})



/* airport endpoints */

// POST webservice to add new airport to database
// ADMIN VERIFICATION REQUIRED
app.post('/airport', verifyFn.verifyToken, verifyFn.verifyAdmin, (req, res) => {
    Airport.addAirport(req.body, (err, result) => {

        if (err) {
            //The airport name provided already exists
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(err.code)
                res.status(422).send('The airport name provided already exists')
                return
            }

            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200)
        res.json({ success: true, result: result, status: 'Airport added!' });
    })
})

// GET webservice to retrieve all airports' data
app.get('/airport', (req, res) => {
    Airport.getAirports((err, airports) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200)
        res.json({ success: true, result: airports, status: 'Airport retrieved!' });
    })
})



/* flight endpoints */

// POST webservice to add new flight to database
// ADMIN VERIFICATION REQUIRED
app.post('/flight/', verifyFn.verifyToken, verifyFn.verifyAdmin, (req, res) => {
    Flight.addFlight(req.body, (err, flightid) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200)
        res.json({ success: true, result: flightid, status: 'Flight added!' });

    })
})

//GET webservice to get ALL flights
app.get('/flight', (req, res) => {
    Flight.getFlights((err, airports) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful

        res.status(200).send(airports)
    })
})


// GET webservice to retrieve info of direct flights by airportid
app.get('/flightDirect/:originAirportId/:destinationAirportId/:embarkDate', (req, res) => {
    const originAirportId = req.params.originAirportId
    const destinationAirportId = req.params.destinationAirportId
    var embarkDate = req.params.embarkDate

    embarkDate = `%${embarkDate}%`

    Flight.getDirectFlightInfo(originAirportId, destinationAirportId, embarkDate, (err, flightInfo) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200)
        res.json({ success: true, result: flightInfo, status: 'Retrieving flights!' });

    })
})


// GET webservice to retrieve info of transfer flights by airportid
app.get('/transfer/flight/:originAirportId/:destinationAirportId', (req, res) => {
    const originAirportId = req.params.originAirportId
    const destinationAirportId = req.params.destinationAirportId
    Flight.getTransferFlightInfo(originAirportId, destinationAirportId, (err, result) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown error')
            return
        }
        //Successful
        res.status(200).send(result)
    })
})



/* booking endpoints */

// POST webservice to add new booking for a flight
// USER VERIFICATION NEEDED
app.post('/booking/:userid/:flightid', verifyFn.verifyToken, verifyFn.verifyUser, (req, res) => {
    const userid = req.params.userid
    const flightid = req.params.flightid
    Booking.addBooking(userid, flightid, req.body, (err, bookingid) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(201)
        res.json({ success: true, result: bookingid, status: 'Added booking!' });
    })
})

//GET webservice to get all bookings of a user
// USER VERIFICATION NEEDED
app.get('/booking/:userid', verifyFn.verifyToken, verifyFn.verifyUser, (req, res) => {
    const userid = req.params.userid
    Booking.getBookingByID(userid, (err, bookings) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200)
        res.json({ success: true, result: bookings, status: 'Retrieving bookings!' });
    })

})

// DELETE webservice to delete flight and its associated bookings
app.delete('/flight/:id', (req, res) => {
    const flightid = req.params.id
    Flight.deleteFlight(flightid, (err) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }

        //Successful
        res.status(200).send('{"Message": "Deletion successful"}')
    })

})


/* promotion endpoints */

// GET webservice to retrieve promotions for all flights
app.get('/promotions/', (req, res) => {
    Promotion.getPromotions((err, promotions) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200).send(promotions)
    })
})
// GET webservice to retrieve promotion of flights by flightid
app.get('/promotions/flight/:flightid/', (req, res) => {
    const flightid = req.params.flightid
    Promotion.getPromotionByID(flightid, (err, promotion) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200).send(promotion)
    })
})
// POST webservice to add new promotion for a flight
app.post('/promotions/flight/:flightid/', (req, res) => {
    const flightid = req.params.flightid
    /* request body schema:
    discounted_price,
    start_period,
    end_period
    */
    Promotion.addPromotion(flightid, req.body, (err, id) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(201).send({ id })
    })
})
// DELETE webservice to delete flight promotion
app.delete('/promotions/:id', (req, res) => {
    const promotionid = req.params.id
    Promotion.deletePromotion(promotionid, (err) => {
        if (err) {
            //Unknown error
            console.log(err)
            res.status(500).send('Unknown Error')
            return
        }
        //Successful
        res.status(200).send('{"Message": "Deletion successful"}')
    })
})
module.exports = app