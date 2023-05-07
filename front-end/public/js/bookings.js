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

//displays welcome text if logged in
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

//check if user is logged in to display appropriate navbar items
function checkLogin() {
    

    if (localStorage.getItem('token') !== null) {
        let htmltext = `
        <a class="nav-link px-3" aria-current="page" href="./profile.html">Profile</a>
        <a class="nav-link px-3 active" aria-current="page" href="./bookings.html">My Bookings</a>`
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
    alert('Please log in to view your bookings!')

}

//retrieve a user's bookings
function getBookings() {
    $('.bookings-list').empty()

    //retrieve userid value from localStorage
    const token = localStorage.getItem('token')
    var userInfoObject = JSON.parse(localStorage.getItem('userInfo'))[0]
    const userid = userInfoObject.userid

    //send request to get bookings of a user
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `http://localhost:8081/booking/${userid}`,
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            const bookings = data.result
            if (bookings.length != 0) {
                //display bookings
                for (item in bookings) {
                    var booking = `
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-3" style="border-right: 1px gray dotted;">
                                <h3 class="bookings-header">Booking ID: ${bookings[item].bookingid}</h3>
                                <p>
                                <b>Name:</b> ${bookings[item].name}<br>
                                <b>Passport:</b> ${bookings[item].passport}<br>
                                <b>Nationality:</b> ${bookings[item].nationality}<br>
                                <b>Age:</b> ${bookings[item].age}<br>
                                </p>
                            </div>
                            <div class="col-1"></div>

                            <div class="col-8">
                                <h3 class="bookings-header">${bookings[item].flightCode}</h3>
                                <div class="row">
                                    <div class="col-6">
                                        <p>
                                            <b>Aircraft:</b> ${bookings[item].aircraft}<br>
                                            <b>Original Airport:</b> ${bookings[item].originAirport_name}<br>
                                            <b>Destination Airport:</b> ${bookings[item].destinationAirport_name}
                                        </p>
                                    </div>
                                    <div class="col-6">
                                        <p>
                                            <b>Embark Date:</b> ${bookings[item].embarkDate}<br>
                                            <b>Travel Time:</b> ${bookings[item].travelTime}<br>
                                            <b>Price:</b> $${bookings[item].price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </li>`
                    $('.bookings-list').append(booking)
                }
            }
            else {
                //no bookings
                let htmltext = '<li class="list-group-item">You have no bookings.</li>'
                $('.bookings-list').append(htmltext)
            }
        },
        error: function (xhr, textStatus, err) {
            console.log('Error!')
        }
    })
}
$(document).ready(function () {
    //prevent page from displaying early before user login is checked.
    $('body').css('display', 'none');
    checkLogin();
    getBookings();

})