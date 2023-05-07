//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496





//send token to server, decode token, send back true or false
//(is admin or not)
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

//sends GET request to retrieve all airports in database
function getAirports() {
    $('#input-from').empty()
    $('#input-to').empty()
    var option = `<option selected disabled>Choose an airport</option>`
    $('#input-from').append(option)
    $('#input-to').append(option)
    $.ajax({
        url: 'http://localhost:8081/airport',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const airports = data.result
            if (airports != null) {
                for (item in airports) {
                    var option = '<option value=' + airports[item].airportid + '>' + airports[item].name + '</option>'
                    $('#input-from').append(option)
                    $('#input-to').append(option)
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

//to find and display the search results
function displaySearchResults(original, destination, originalCountry, destinationCountry, departDate, count, isFirstTime) {
    $.ajax({
        url: `http://localhost:8081/flightDirect/${original}/${destination}/${departDate}`,
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const flights = data.result


            if (flights.length != 0) {
                //flights found!


                var header = `
<h2 class="country-header-found flight-item">
    ${originalCountry} <i class='fas fa-arrow-right' style='font-size:30px'></i> ${destinationCountry}
</h2>
`
                $('#flight-results').append(header)

                if (isFirstTime) { count = 1 }
                else { count = 3000 }
                for (item in flights) {
                    var datetime = flights[item].embarkDate.split(' ')
                    var date = datetime[0]
                    var time = datetime[1]
                    date = convertDate(date)

                    var text = `
<div class="flight-item">
    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="pills-brief-tab-${count}" data-bs-toggle="pill"
                data-bs-target="#pills-brief-${count}" type="button" role="tab" aria-controls="pills-brief-${count}"
                aria-selected="true">Flight</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="pills-detailed-tab-${count}" data-bs-toggle="pill"
                data-bs-target="#pills-detailed-${count}" type="button" role="tab" aria-controls="pills-detailed-${count}"
                aria-selected="false">More Information</button>
        </li>
        <div class="form-check flightCheckbox">
            <input class="form-check-input selectedflightid-${flights[item].flightid}" type="checkbox" name="bookselect">
            <label class="form-check-label" for="bookselect">
                Select this flight
            </label>
        </div>
    </ul>
    <div class="tab-content tab-content-search" id="pills-tabContent">
        <!-- Flight tab -->
        <div class="tab-pane home-tab fade show active" id="pills-brief-${count}" role="tabpanel"
            aria-labelledby="pills-brief-tab-${count}">
            <div class="row">
                <h6>Departs on <span class="underline">${date}, ${time}</span></h6>
                <div class="col-3">
                    <h3>${flights[item].originAirport}</h3>
                    <h6>${flights[item].originCountry}</h6>
                </div>

                <div class="col-3">
                    <img src="./image/landing-plane.png" id="landing-plane" alt="Plane">
                </div>


                <div class="col-4">
                    <h3>${flights[item].destinationAirport}</h3>
                    <h6>${flights[item].destinationCountry}</h6>
                </div>

                <div class="col-2">
                    <h3>$${flights[item].price}</h3>
                </div>
            </div>
        </div>
        <!-- More Info tab -->
        <div class="tab-pane home-tab fade" id="pills-detailed-${count}" role="tabpanel" aria-labelledby="pills-detailed-tab-${count}">

            <div class="row row-1">
                <h2 class="col-6"><b>${flights[item].flightCode}</b></h2>
                <div class="col-6" id="aircraft-div">
                    <h6 class="float-r" id="aircraft-div-content">Aircraft: <span class="underline">${flights[item].aircraft}</span></h6>
                </div>
                
            </div>

            <div class="row row-2">
                <div class="col-6">
                    <h6>Departs on <span class="underline">${date}, ${time}</span></h6>
                </div>

                <div class="col-6" id="traveltime-div">
                    <h6 class="float-r" id="traveltime-div-content">Travel Time: <span class="underline">${flights[item].travelTime}</span></h6>
                </div>
            </div>

            <hr>

            <div class="row row-3">


                <div class="col-3">
                    <h3>${flights[item].originAirport}</h3>
                    <h6>${flights[item].originCountry}</h6>
                </div>

                <div class="col-3">
                    <img src="./image/landing-plane.png" id="landing-plane" alt="Plane">
                </div>


                <div class="col-4">
                    <h3>${flights[item].destinationAirport}</h3>
                    <h6>${flights[item].destinationCountry}</h6>
                </div>

                <div class="col-2">
                    <h3>$${flights[item].price}</h3>
                </div>

            </div>
        </div>

    </div>
    
</div>`

                    $('#flight-results').append(text)
                    count++
                }

                //insert book flight button at the end
                $('#book').css('display', '')
                // $('#flight-results').append(`
                // <button type="button" id="book" class="customButton">Book selected flights</button>`)
            }


            else {
                //no flights found
                console.log('no flights found.')
                var header = `
<h2 class="country-header-notfound flight-item">
    No flights found from ${originalCountry} <i class='fas fa-arrow-right' style='font-size:30px'></i> ${destinationCountry} on this date.
</h2>
`
                $('#flight-results').append(header)
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }

    })


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

//check if date2 is after date1
function isAfterDate1(date1, date2) {
    return date2 >= date1;
}

//check if any flights with the date input by the user exists
function searchButton() {
    // Search button is clicked

    $('#search').click(function () {

        console.log('Searching for flights..')


        //retrieve values from textboxes
        const original = $('#input-from').val()
        const destination = $('#input-to').val()

        const originalCountry = $('#input-from option:selected').text()
        const destinationCountry = $('#input-to option:selected').text()

        var departDate = $('#input-departDate').val()
        var returnDate = $('#input-returnDate').val()

        //validate input
        if (original == null || destination == null || departDate == '') {

            $('#msg1').css('background-color', 'red')
            $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all required fields.')
            $('#msg1').css('display', 'inline')
            setTimeout(function () { $("#msg1").hide(); }, 3000);
            return
        }

        //check if departDate is earlier than current date
        var today = new Date();
        today.setHours(0, 0, 0, 0)
        var date = new Date(departDate);


        validDate = isAfterDate1(today, date)

        if (!validDate) {
            $('#msg1').css('background-color', 'red')
            $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a depart date equal or after today.')
            $('#msg1').css('display', 'inline')
            setTimeout(function () { $("#msg1").hide(); }, 3000);
            return
        }

        //check if returnDate is earlier than departDate
        if (returnDate != '') {
            var date1 = new Date(departDate);
            var date2 = new Date(returnDate);

            validDate = isAfterDate1(date1, date2)

            if (!validDate) {
                $('#msg1').css('background-color', 'red')
                $('#msg1').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a return date equal or after the depart date.')
                $('#msg1').css('display', 'inline')
                setTimeout(function () { $("#msg1").hide(); }, 3000);
                return
            }
        }

        $('#flight-results').empty()

        var departDate = departDate.replace(/-/g, `/`)
        var returnDate = returnDate.replace(/-/g, `/`)

        //URL Encode values to put in URL parameters
        var departDate = encodeURIComponent(departDate)
        var returnDate = encodeURIComponent(returnDate)

        console.log('input is valid!')


        //check if user searched for ONE-WAY or TWO-WAY flight
        // let A = originAirport (from), B = destinationAirport (to)
        var count = 1
        var isFirstTime = true

        if (returnDate == '') {
            //Send request to retrieve ONE-WAY flights
            displaySearchResults(original, destination, originalCountry, destinationCountry, departDate, count, isFirstTime)
        }
        else {
            //Send request to retrieve TWO-WAY flights
            //look for flights that go from A to B first
            displaySearchResults(original, destination, originalCountry, destinationCountry, departDate, count, isFirstTime)
            var isFirstTime = false
            //look for flights that go from B to A
            displaySearchResults(destination, original, destinationCountry, originalCountry, returnDate, count, isFirstTime)
            console.log('Search finished')
        }

        window.scrollTo(0, 550);
    })

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
                        </div>
                        `
    $('.container-fluid').append(welcometext)
}

//check if user is logged in to display appropriate navbar items
function checkLogin() {
    if (localStorage.getItem('token') !== null) {
        // If user is logged in, check if customer or admin
        let htmltext = `<a class="nav-link px-3" href="./profile.html">Profile</a>
                        <a class="nav-link px-3" href="./bookings.html">My Bookings</a>`
        const isAdmin = checkAdminRole()

        if (isAdmin) {
            htmltext += `<a class="nav-link px-3"  href="./administration.html">Administration</a>`
        };
        $('.navbar-nav').append(htmltext)

        welcometext();


    } else {
        // User not logged in
        console.log('not logged in')
        let htmltext = `<a class="nav-link px-3"  href="./login.html">Login</a>`
        $('.navbar-nav').append(htmltext)
    }
}

//submit bookings to shopping cart
function bookButton() {
    //Book button is clicked

    $('#book').click(function () {

        if (localStorage.getItem('token') !== null) {
            //user is logged in, allow booking of flight
            console.log('Booking flights..')

            //see which flights are selected.
            var $boxes = $('input[name=bookselect]:checked');

            if ($boxes.length == 0) {
                //no flights selected.
                $('#msg2').css('background-color', 'red')
                $('#msg2').html('<i class="fa fa-warning" style="font-size:16px"></i> Please select flights to add to cart!')
                $('#msg2').css('display', 'inline')
                setTimeout(function () { $("#msg2").hide(); }, 3000);
                return
            }
            var selectedFlightsArray = []
            for (let i = 0; i < $boxes.length; i++) {
                var checkboxNo = $boxes[i].className.split(' ')[1]
                selectedFlightsArray.push(checkboxNo)
            }

            currentShoppingCart = JSON.parse(localStorage.getItem('cart'))

            //add selected flights to cart
            for (let i = 0; i < selectedFlightsArray.length; i++) {
                currentShoppingCart.push(selectedFlightsArray[i])
            }



            localStorage.setItem('cart', JSON.stringify(currentShoppingCart))

            //uncheck all checkboxes
            $(':checkbox').each(function () {
                this.checked = false;
            });

            $('#msg2').css('background-color', 'greenyellow')
            $('#msg2').text('Flights added to cart!')
            $('#msg2').css('display', 'inline')
            setTimeout(function () { $("#msg2").hide(); }, 3000);

            //check if user is logged in before booking
        }
        else {
            alert('Please log in to book flights!')
            return
        }

    })
}

$(document).ready(function () {
    checkLogin();
    getAirports();
    searchButton();
    bookButton();
})


