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

//converts date from number to string format
function convertDate(date) {
    dateArray = date.split('-')
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
    //check if user logged in

    if (localStorage.getItem('token') !== null) {
        let htmltext = `<a class="nav-link px-3 active" aria-current="page" href="./profile.html">Profile</a>
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
    alert('Please log in to view your profile!')
    
}

//clear localStorage, allows user to logout
function logoutButton() {
    $('#logout').click(function () {
        //clear the localStorage
        window.localStorage.clear()
        //redirect back to login page
        console.log('logging out')
        window.location.assign('http://localhost:3001/home.html')
    })
}

//updates user info
function updateButton() {
    $('#update').click(function () {
        console.log('Update button clicked.')


        //retrieve values from the textboxes
        var username = $('#username').val()
        var email = $('#email').val()
        var contact = $('#contact').val()

        //validate input
        if (username == '' || email == '' || contact == '') {
            console.log('no input')
            $('#msg').css('background-color', 'red')
            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all fields.')
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }

        //regex of email
        if (!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            //email not valid
            console.log('email not valid')
            $('#msg').css('background-color', 'red')
            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a valid email.')
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }

        //regex of contact
        if (!contact.match(/^\d+$/)) {
            //contact does not only have numbers inside
            console.log('contact not valid')
            $('#msg').css('background-color', 'red')
            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Please enter a valid contact number.')
            $('#msg').css('display', 'inline')
            setTimeout(function () { $("#msg").hide(); }, 3000);
            return
        }

        // all input is valid.

        //retrieve values from localStorage
        const token = localStorage.getItem('token')
        var userInfoObject = JSON.parse(localStorage.getItem('userInfo'))[0]
        const userid = userInfoObject.userid

        //prepare request data
        const data = `{"username":"${username}","email":"${email}","contact":"${contact}"}`

        //Send request to update profile information
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: `http://localhost:8081/users/${userid}`,
            type: 'PUT',
            data: data,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                if (data != null && data.success) {
                    $('#msg').css('background-color', 'greenyellow')
                    $('#msg').text('Profile updated!')
                    $('#msg').css('display', 'inline')
                    setTimeout(function () { $("#msg").hide(); }, 3000);
                    $('#username').val(username)
                    $('#email').val(email)
                    $('#contact').val(contact)

                    //Send request to get new profile info to put in localStorage.userInfo
                    $.ajax({
                        headers: { 'authorization': 'Bearer ' + token },
                        url: `http://localhost:8081/users/${userid}`,
                        type: 'GET',
                        dataType: 'json',
                        success: function (data, textStatus, xhr) {
                            localStorage.setItem('userInfo', JSON.stringify(data))

                            //display welcome text with new username
                            $('.d-flex').empty();
                            welcometext();

                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $('#msg').css('background-color', 'red')
                            $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Profile not updated.')
                            $('#msg').css('display', 'inline')
                            setTimeout(function () { $("#msg").hide(); }, 3000);
                            console.log('Error!')

                        }
                    })

                }
                else {
                    $('#msg').css('background-color', 'red')
                    $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Profile not updated.')
                    $('#msg').css('display', 'inline')
                    setTimeout(function () { $("#msg").hide(); }, 3000);
                    console.log('Data is null')
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                if (errorThrown === 'Unprocessable Entity') {
                    //username or email already exists
                    $('#msg').css('background-color', 'red')
                    $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> This username or email already exists.')
                    $('#msg').css('display', 'inline')
                    setTimeout(function () { $("#msg").hide(); }, 3000);
                    console.log('Error!')
                } else if (errorThrown === 'Forbidden') {
                    // not authorised
                    $('#msg').css('background-color', 'red')
                    $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> You are not authorised to carry out this action.')
                    $('#msg').css('display', 'inline')
                    setTimeout(function () { $("#msg").hide(); }, 3000);
                    console.log('Error!')
                } else {
                    //other errors 
                    $('#msg').css('background-color', 'red')
                    $('#msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Profile not updated.')
                    $('#msg').css('display', 'inline')
                    setTimeout(function () { $("#msg").hide(); }, 3000);
                    console.log('Error!')
                }
            }

        });

        return false

    })

}

//populate user info to textboxes
function fillTextboxes() {
    //retrieve userInfo from localStorage
    const userData = localStorage.getItem('userInfo')
    const userJsonData = JSON.parse(userData)

    //filling in textboxes
    var created_at = (userJsonData[0].created_at).split(' ')[0]
    //Change date to word format
    created_at = convertDate(created_at)
    $('#created_at').append(created_at)
    $('#username').val(userJsonData[0].username)
    $('#email').val(userJsonData[0].email)
    $('#contact').val(userJsonData[0].contact)
    $('#role').append(userJsonData[0].role)
    const pic = userJsonData[0].profile_pic_url

    // if no profile pic, use default profile pic
    if (pic != null)
        $('#profilepic').attr('src', pic)
}

$(document).ready(function () {
    //prevent page from displaying early before user login is checked.
    $('body').css('display', 'none');
    checkLogin();
    fillTextboxes();
    updateButton();
    logoutButton();
})
