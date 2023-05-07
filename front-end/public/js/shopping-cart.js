//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496



//send token to server, decode token, send back true or false
// (is admin or not)
function checkAdminRole() {

    //retrieve token from localStorage
    const token = localStorage.getItem('token')

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: 'http://localhost:8081/role',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            if (data.isAdmin) {
                //user is admin
                userInfo = JSON.parse(localStorage.getItem('userInfo'))
                userInfo[0].role = 'Admin'
                localStorage.setItem('userInfo', JSON.stringify(userInfo))

            } else {
                //user NOT admin
                var userInfo = JSON.parse(localStorage.getItem('userInfo'))
                userInfo[0].role = 'Customer'
                localStorage.setItem('userInfo', JSON.stringify(userInfo))

            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }
    })


    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const role = userInfo[0].role
    if (role == 'Admin') {
        return true
    }
    else {
        return false
    }




}

//display welcome text if logged in
function welcometext() {
    const username = JSON.parse(localStorage.userInfo)[0].username
    var profile_pic_url = JSON.parse(localStorage.userInfo)[0].profile_pic_url
    if (profile_pic_url == null) {
        profile_pic_url = './image/profile.jpg'
    }
    let welcometext = `<div class="d-flex">
                                        <p class="welcometext">Welcome, ${username}</p>
                                        <a href="./profile.html"><img src="${profile_pic_url}" alt="pic" id="mini-profilepic"></a>

                                        
                            <a href="./shopping-cart.html"><img src="./image/shopping-cart.png" id="cart-nav-image-active" alt="Cart"></a>
                                    </div>`
    $('.container-fluid').append(welcometext)
}

//check if user is logged in to display appropriate navbar items
function checkLogin() {
    //check if user logged in

    if (localStorage.getItem('token') !== null) {
        let htmltext = `<a class="nav-link px-3" aria-current="page" href="./profile.html">Profile</a>
                        <a class="nav-link px-3" href="./bookings.html">My Bookings</a>`
        const isAdmin = checkAdminRole()

        if (isAdmin) {
            htmltext += `<a class="nav-link px-3"  href="./administration.html">Administration</a>`
        }
        $('.navbar-nav').append(htmltext)

        welcometext();

        //if the user is logged in, then show the page.
        $('body').css('display', '');
        return
    }

    //user not logged in
    window.location.assign('http://localhost:3001/login.html')
    alert('Please log in to view your shopping cart!')

}

//converts date from number to string format
function convertDate(date) {
    dateArray = date.split('/')
    const year = parseInt(dateArray[0])
    const day = parseInt(dateArray[2])
    var month = parseInt(dateArray[1])
    switch (month) {
        case 1: month = 'January'; break;
        case 2: month = 'February'; break;
        case 3: month = 'March'; break;
        case 4: month = 'April'; break;
        case 5: month = 'May'; break;
        case 6: month = 'June'; break;
        case 7: month = 'July'; break;
        case 8: month = 'August'; break;
        case 9: month = 'September'; break;
        case 10: month = 'October'; break;
        case 11: month = 'November'; break;
        case 12: month = 'December'; break;
    }

    newdate = `${day} ${month} ${year}`
    return newdate
}

//check localstorage for flights that are in the cart and display
function displayCart() {


    $('.cart-list').empty()
    currentShoppingCart = JSON.parse(localStorage.getItem('cart'))
    if (currentShoppingCart.length == 0) {
        //Nothing in cart
        var text = `<li class="list-group-item">You have no items in your cart.</li>`
        $('.cart-list').append(text)
        return
    }

    bookedflightids = []
    for (let i = 0; i < currentShoppingCart.length; i++) {
        bookedflightids.push(currentShoppingCart[i].split('-')[1])
    }


    //send request to get all flights
    $.ajax({
        url: 'http://localhost:8081/flight',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const flights = data
            var bookedFlightsObjects = []
            if (flights != null) {

                //filter the flights booked
                for (let bookedIndex = 0; bookedIndex < bookedflightids.length; bookedIndex++) {
                    for (let flightsIndex = 0; flightsIndex < flights.length; flightsIndex++) {
                        if (bookedflightids[bookedIndex] == flights[flightsIndex].flightid) {
                            bookedFlightsObjects.push(flights[flightsIndex])
                            break
                        }
                    }
                }


                //sort array of objects by flightid
                bookedFlightsObjects.sort((a, b) => {
                    return a.flightid - b.flightid
                })

                var totalPrice = 0
                //display items in cart

                console.log(bookedFlightsObjects)

                for (item in bookedFlightsObjects) {

                    // corrected error after 1 sem. used to be
                    // var datetime = flights[item].embarkDate.split(' ')
                    // now it shows correct date and time of the booking.
                    var datetime = bookedFlightsObjects[item].embarkDate.split(' ')
                    var date = datetime[0]
                    var time = datetime[1]
                    date = convertDate(date)
                    var text = `
                            <li class="list-group-item">
                                <div class="row">
                                    
                                    <div class="col-1">
                                        <h4><b>${parseInt(item) + 1}</b></h4>
                                    </div>
                                    <div class="col-8">
                                        <h4 class="m-0">${bookedFlightsObjects[item].flightCode} (${bookedFlightsObjects[item].originAirport} - ${bookedFlightsObjects[item].destinationAirport}) </h4>
                                        <br>
                                        <span class="text-muted"><h6>Embark Date: ${date}, ${time}</h6></span>
                                    </div>


                                    <div class="col-2">
                                        <h4>$${bookedFlightsObjects[item].price}</h4>

                                    </div>

                                
                                </div>
                                
                                
                            </li>`
                    $('.cart-list').append(text)

                    //calculate total price
                    totalPrice += bookedFlightsObjects[item].price
                }

                console.log(totalPrice)
                var totalPriceText = `
                        <li class="list-group-item">
                            <div class="row">
                                <div class="col-1"></div>
                                <div class="col-8">
                                    <h4><b>Total Price</b></h4>
                                </div>
                                <div class="col-3">
                                    <h4><b>$${totalPrice}</b></h4>
                                </div>

                            </div>
                            
                        </li>`

                $('.cart-list').append(totalPriceText)

                //display form to key in user info


                $('.booking-form').prepend(
                    `
            <h4>You're one step away from flying with SP Air!</h4>
            <h6>Please fill in some information to complete your booking process.</h6>
            <br><br>
            <div class="row">

            
            <h5>Personal Information</h5>
                <div class="row">
                    <div class="userName form-margin col-5">
                        <input type="text" class="form-control" id="input-userName" placeholder="Name">
                    </div>

                    <div class="userPassport form-margin col-5">
                        <input type="text" class="form-control" id="input-userPassport" placeholder="Passport">
                    </div>
                </div>

                <div class="row">
                    <div class="userNationality form-margin col-5">
                        <input type="text" class="form-control" id="input-userNationality" placeholder="Nationality">
                    </div>

                    <div class="userAge form-margin col-5">
                        <input type="number" min="18" class="form-control" id="input-userAge" placeholder="Age">
                        <div id="HelpBlock" class="form-text">
                            *Must be over 18
                        </div>
                    </div>
                </div>

                <h5>Payment Details</h5>
                <div class="row">
                    <div class="userCardNo form-margin col-8">
                        <input type="number" class="form-control" id="input-userCardNo" placeholder="Card Number">
                    </div>

                    <div class="userCVV form-margin col-2">
                        <input type="number" class="form-control" id="input-userCVV" placeholder="CVV">
                    </div>
                </div>
            </div>

        `
                )

                $('#booking-userinfo').css('display', '')

            }
            else {
                console.log('data is null')
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('error')
        }
    })
}

//submit flights in shopping cart to bookings database
function bookFlightsButton() {
    $('#bookFlights').click(function () {
        console.log('Book Flights button clicked')

        //retrieve values from the textboxes
        const name = $('#input-userName').val()
        const age = $('#input-userAge').val()
        const nationality = $('#input-userNationality').val()
        const passport = $('#input-userPassport').val()
        const cardno = $('#input-userCardNo').val()
        const cvv = $('#input-userCVV').val()


        //validate input
        if (name == '' || age == '' || nationality == '' || passport == '' || cardno == '' || cvv == '') {
            console.log('Input is invalid')
            $('#msg').css('background-color', 'red')
            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all fields.')
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }

        //check if user is above 18
        if (parseInt(age) < 18) {
            console.log('too young')
            $('#msg').css('background-color', 'red')
            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Sorry, you must be above 18 to book.')
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }

        //validate if age, cardno, cvv is integer 
        var invalidmsg = ''
        if (age % 1 != 0) {
            invalidmsg = `Please enter a valid age.`
        }

        //cardno must contain 16 digits
        if (cardno % 1 != 0 || cardno <= 0 || cardno.length != 16) {
            invalidmsg = `Your card number must contain 16 digits.`
        }

        //cvv must contain 3
        if (cvv % 1 != 0 || cvv <= 0 || cvv.length != 3) {
            invalidmsg = `Your CVV must contain 3 digits.`
        }

        if (invalidmsg != '') {
            //invalid
            console.log('not valid')
            $('#msg').css('background-color', 'red')
            $('#msg').html(`<i class="fa fa-warning" style="font-size:16px"></i> ${invalidmsg}`)
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }




        console.log('input is valid')
        cart = JSON.parse(localStorage.getItem('cart'))
        cartLength = cart.length

        //retrieve values from localStorage
        const token = localStorage.getItem('token')

        var userInfoObject = JSON.parse(localStorage.getItem('userInfo'))[0]
        const userid = userInfoObject.userid

        //prepare request data
        const data = `{"name":"${name}","age":"${age}","nationality":"${nationality}","passport":"${passport}"}`

        //send request to add bookings

        for (let i = 0; i < cartLength; i++) {

            var flightid = cart[i].split('-')[1]
            $.ajax({
                headers: { 'authorization': 'Bearer ' + token },
                url: `http://localhost:8081/booking/${userid}/${flightid}`,
                type: 'POST',
                data: data,
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    console.log('Bookings added to database')


                },
                error: function (xhr, textStatus, errorThrown) {
                    if (errorThrown === 'Forbidden') {
                        // not authorised
                        $('#msg').css('background-color', 'red')
                        $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> You are not authorised to carry out this action.')
                        $('#msg').css('display', 'inline')
                        setTimeout(function () { $("#msg").hide(); }, 3000);
                        console.log('Error!')
                    } else {
                        //other errors 
                        $('#msg').css('background-color', 'red')
                        $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Bookings not created.')
                        $('#msg').css('display', 'inline')
                        setTimeout(function () { $("#msg").hide(); }, 3000);
                        console.log('Error!')
                    }
                }
            })

        }


        //clear cart
        localStorage.setItem('cart', '[]')

        //redirect to bookings page
        window.location.assign('http://localhost:3001/bookings.html')
        alert('Bookings created. Thank you for flying with us!')


    })
}

//clear shopping cart
function clearCartButton() {
    $('#clearCart').click(function () {
        console.log('Cleart Cart button clicked.')

        localStorage.setItem('cart', '[]')

        window.location.reload()
    })
}


$(document).ready(function () {
    //prevent page from displaying early before user login is checked.
    $('body').css('display', 'none');
    checkLogin();
    displayCart();
    clearCartButton();
    bookFlightsButton();
})