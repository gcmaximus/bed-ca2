//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496





//send token to server, decode token, send back true or false
//(is admin or not)
// to prevent force browsing
function checkAdminRole() {

    //retrieve token from localStorage
    const token = localStorage.getItem('token')

    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: 'http://localhost:8081/role',
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            if (data.isAdmin) {
                //user is admin
                var userInfo = JSON.parse(localStorage.getItem('userInfo'))
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

//display welcome text
function welcometext() {
    const username = JSON.parse(localStorage.userInfo)[0].username
    var profile_pic_url = JSON.parse(localStorage.userInfo)[0].profile_pic_url
    if (profile_pic_url == null) {
        profile_pic_url = './image/profile.jpg'
    }
    let welcometext = `<div class="d-flex">
                                        <p class="welcometext">Welcome, ${username}</p>
                                        <a href="./profile.html"><img src="${profile_pic_url}" alt="pic" id="mini-profilepic"></a>

                                        
                                        <a href="./shopping-cart.html"><img src="./image/shopping-cart.png" id="cart-nav-image" alt="Cart"></a>
                                    </div>`
    $('.container-fluid').append(welcometext)
}

//check if user is admin before displaying administration page
function checkAdmin() {
    //check if user logged in
    if (localStorage.getItem('token') !== null) {
        const isAdmin = checkAdminRole()

        if (isAdmin) {
            console.log('logged in as admin')
            //display welcome text
            welcometext()
            //if Admin role is verified, then show the page.
            $('body').css('display', '');
            return
        }
    }
    window.location.assign('http://localhost:3001/home.html')
    alert('You are not authorised to carry out this action.')

}

//sends GET request to retrieve all airports in database to display as 
//options when adding flight
function getAirportsOption() {
    $('#input-originAirport').empty()
    $('#input-destinationAirport').empty()
    var option = `<option selected disabled>Choose an airport</option>`
    $('#input-originAirport').append(option)
    $('#input-destinationAirport').append(option)
    $.ajax({
        url: 'http://localhost:8081/airport',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const airports = data.result
            if (airports != null) {
                for (item in airports) {
                    var option = '<option value=' + airports[item].airportid + '>' + airports[item].name + '</option>'
                    $('#input-originAirport').append(option)
                    $('#input-destinationAirport').append(option)
                }
            }
            else {
                console.log('data is null')
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }
    })
}

//sends GET request to retrieve all airports in database to display
function getAirportsCard() {
    $.ajax({
        url: 'http://localhost:8081/airport',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const airports = data.result
            if (airports != null) {
                for (item in airports) {
                    var text = `
                            <div class="card-airport card grid-item">
                                <div class="img-box">
                                    <img class="card-img-top" src="./image/airport.jpg" alt="Airport">
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title">Airport ID: ${airports[item].airportid}</h3>
                                    <p class="card-text">
                                        <b>Name:</b> ${airports[item].name}<br>
                                        <b>Country:</b> ${airports[item].country}<br>
                                        <b>Description:</b> ${airports[item].description}
                                    </p>
                                </div>
                            </div>`

                    $('#airports').append(text)
                }
            }
            else {
                console.log('data is null')
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }
    })
}

//sends GET request to retrieve all flights in database
function getFlights() {
    $.ajax({
        url: 'http://localhost:8081/flight',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const flights = data
            if (flights != null) {
                for (item in flights) {
                    var text = `
                            <div class="card-flight card grid-item">
                                <div class="img-box">
                                    <img class="card-img-top" src="./image/airplane.jpg" alt="Airplane">
                                </div>
                                <div class="card-body">
                                    <h3 class="card-title">Flight ID: ${flights[item].flightid}</h3>
                                    <p class="card-text">
                                        <b>Flight Code:</b> ${flights[item].flightCode}<br>
                                        <b>Aircraft:</b> ${flights[item].aircraft}<br>
                                        <b>Original Airport:</b> ${flights[item].originAirport}<br>
                                        <b>Destination Airport:</b> ${flights[item].destinationAirport}<br>
                                        <b>Embark Date:</b> ${flights[item].embarkDate}<br>
                                        <b>Travel Time:</b> ${flights[item].travelTime}<br>
                                        <b>Price:</b> $${flights[item].price}
                                    </p>
                                </div>
                            </div>`

                    $('#flights').append(text)
                }
            }
            else {
                console.log('data is null')
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }
    })
}

//add airport to database
function addAirportButton() {
    $('#addAirport').click(function () {
        console.log('Add Airport button clicked.')



        //retrieve values from the textboxes
        const name = $('#input-name').val()
        const country = $('#input-country').val()
        const description = $('#input-desc').val()

        //validate input
        if (name == '' || country == '' || description == '') {
            $('#msg1').css('background-color', 'red')
            $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all fields.')
            $('#msg1').css('display', 'inline')
            setTimeout(function () { $("#msg1").hide(); }, 3000);
            return
        }

        //retrieve token from localStorage
        const token = localStorage.getItem('token')

        //prepare request data
        const data = `{"name":"${name}","country":"${country}","description":"${description}"}`

        //Send request to add airport information
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: 'http://localhost:8081/airport',
            type: 'POST',
            data: data,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                if (data != null && data.success) {
                    $('#msg1').css('background-color', 'greenyellow')
                    $('#msg1').text('Airport added!')
                    $('#msg1').css('display', 'inline')
                    setTimeout(function () { $("#msg1").hide(); }, 3000);
                    //clear textboxes
                    $('#input-name').val('')
                    $('#input-country').val('')
                    $('#input-desc').val('')

                    //clear the airports div
                    $('#airports').empty();

                    //get latest information from database and display
                    getAirportsCard();
                    getAirportsOption();
                }
                else {
                    $('#msg1').css('background-color', 'red')
                    $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Airport not added.')
                    $('#msg1').css('display', 'inline')
                    setTimeout(function () { $("#msg1").hide(); }, 3000);
                    console.log('Data is null')
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (errorThrown === 'Unprocessable Entity') {
                    //airport name already exists
                    $('#msg1').css('background-color', 'red')
                    $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> This airport name already exists.')
                    $('#msg1').css('display', 'inline')
                    setTimeout(function () { $("#msg1").hide(); }, 3000);
                    console.log('Error!')
                } else if (errorThrown === 'Forbidden') {
                    // not authorised
                    $('#msg1').css('background-color', 'red')
                    $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> You are not authorised to carry out this action.')
                    $('#msg1').css('display', 'inline')
                    setTimeout(function () { $("#msg1").hide(); }, 3000);
                    console.log('Error!')
                } else {
                    //other errors 
                    $('#msg1').css('background-color', 'red')
                    $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Airport not added.')
                    $('#msg1').css('display', 'inline')
                    setTimeout(function () { $("#msg1").hide(); }, 3000);
                    console.log('Error!')
                }
            }
        })
    })
    return false
}

//check if date2 is after date1
function isAfterDate1(date1, date2) {
    return date2 >= date1;
}

//add flight to database
function addFlightButton() {
    $('#addFlight').click(function () {
        console.log('Add Flight button clicked.')


        //retrieve values from the textboxes
        const flightCode = $('#input-flightCode').val()
        const aircraft = $('#input-aircraft').val()
        const price = $('#input-price').val()
        const originAirport = $('#input-originAirport').val()
        const destinationAirport = $('#input-destinationAirport').val()
        const date = $('#input-embarkDate').val()
        const time = $('#input-embarkTime').val()
        var embarkDate = `${date} ${time}`
        var embarkDate = embarkDate.replace(/-/g, `/`)

        const travelTime_days = $('#input-travelTime-days').val()
        const travelTime_hours = $('#input-travelTime-hours').val()
        const travelTime_mins = $('#input-travelTime-mins').val()

        //regex of travelTime
        if (travelTime_days % 1 != 0 || travelTime_hours % 1 != 0 || travelTime_mins % 1 != 0
        || travelTime_days < 0 || travelTime_hours < 0 || travelTime_mins < 0) {
            //travelTime is not positive integer / zero 
            $('#msg2').css('background-color', 'red')
            $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a valid travel time.')
            $('#msg2').css('display', 'inline')
            setTimeout(function () { $("#msg2").hide(); }, 3000);
            return
        }

        // putting travelTime in 'xx days yy hours zz mins' format
        var displayTimes = {
            days: travelTime_days,
            hours: travelTime_hours,
            mins: travelTime_mins
        }

        var travelTime = ''

        for (var key in displayTimes) {
            if (displayTimes[key] == '' || displayTimes[key] == '0')
                delete displayTimes[key]
            else {
                displayTimes[key] = parseInt(displayTimes[key])
                travelTime += `${displayTimes[key]} ${key} `
            }
        }

        travelTime.slice(0, -1)


        //validate input
        if (flightCode == '' || aircraft == '' || price == '' ||
            originAirport == null || destinationAirport == null || embarkDate == '' ||
            travelTime == '') {
            $('#msg2').css('background-color', 'red')
            $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all fields.')
            $('#msg2').css('display', 'inline')
            setTimeout(function () { $("#msg2").hide(); }, 3000);
            return
        }

        //regex of price
        if (isNaN(price) || price <= 0) {
            //price is not a positive number
            $('#msg2').css('background-color', 'red')
            $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a valid price.')
            $('#msg2').css('display', 'inline')
            setTimeout(function () { $("#msg2").hide(); }, 3000);
            return
        }

        //check if embarkDate is after today
        //check if departDate is earlier than current date
        var today = new Date();
        today.setHours(0, 0, 0, 0)
        var embark = new Date(embarkDate);


        validDate = isAfterDate1(today, embark)
        console.log('validDate: ', validDate)

        if (!validDate) {
            $('#msg2').css('background-color', 'red')
            $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter an embark date equal or after today.')
            $('#msg2').css('display', 'inline')
            setTimeout(function () { $("#msg2").hide(); }, 3000);
            return
        }


        //retrieve token from localStorage
        const token = localStorage.getItem('token')
        //prepare request data
        const data = `{"flightCode":"${flightCode}","aircraft":"${aircraft}","originAirport":"${originAirport}",
                "destinationAirport":"${destinationAirport}","embarkDate":"${embarkDate}","travelTime":"${travelTime}",
                "price":"${price}"}`

        //Send request to add flight information
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: 'http://localhost:8081/flight',
            type: 'POST',
            data: data,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                if (data != null && data.success) {
                    $('#msg2').css('background-color', 'greenyellow')
                    $('#msg2').text('Flight added!')
                    $('#msg2').css('display', 'inline')
                    setTimeout(function () { $("#msg2").hide(); }, 3000);

                    //clear textboxes
                    $('#input-flightCode').val('')
                    $('#input-aircraft').val('')
                    $('#input-price').val('')
                    $('#input-originAirport').val('')
                    $('#input-destinationAirport').val('')
                    $('#input-embarkDate').val('')
                    $('#input-embarkTime').val('')
                    $('#input-travelTime-days').val('')
                    $('#input-travelTime-hours').val('')
                    $('#input-travelTime-mins').val('')

                    //clear the flights div
                    $('#flights').empty();

                    //get latest information from database and display
                    getFlights();
                }
                else {
                    $('#msg2').css('background-color', 'red')
                    $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Flight not added.')
                    $('#msg2').css('display', 'inline')
                    setTimeout(function () { $("#msg2").hide(); }, 3000);
                    console.log('Data is null')
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (errorThrown === 'Forbidden') {
                    // not authorised
                    $('#msg2').css('background-color', 'red')
                    $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> You are not authorised to carry out this action.')
                    $('#msg2').css('display', 'inline')
                    setTimeout(function () { $("#msg2").hide(); }, 3000);
                    console.log('Error!')
                } else {
                    //other errors 
                    $('#msg2').css('background-color', 'red')
                    $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Flight not added.')
                    $('#msg2').css('display', 'inline')
                    setTimeout(function () { $("#msg2").hide(); }, 3000);
                    console.log('Error!')
                }
            }
        })
    })
    return false
}


$(document).ready(function () {
    //prevent page from displaying early before role is checked.
    $('body').css('display', 'none');
    checkAdmin();
    $('#airports').empty();
    getAirportsCard();
    $('#flights').empty();
    getFlights();
    getAirportsOption();
    addAirportButton();
    addFlightButton();
})


