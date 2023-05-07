//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496




// check if login credentials are correct
function loginButton() {
    $('#Login').click(function () {
        console.log('Login button clicked.')


        //retrieve values from textboxes
        const email = $('#email').val()
        const password = $('#pw').val()
        const data = `{"email":"${email}", "password":"${password}"}`

        //validate input
        if (email == '' || password == '') {

            $('#login-msg').css('background-color', 'red')
            $('#login-msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Please fill in all fields.')
            $('#login-msg').css('display', 'inline')
            setTimeout(function () { $("#login-msg").hide(); }, 3000);
            console.log('Error!')

            return
        }

        //Send request to check whether user exists
        $.ajax({
            url: 'http://localhost:8081/user/login',
            type: 'POST',
            data: data,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                if (data != null) {
                    //login success
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('userInfo', data.UserData)

                    //create empty shopping cart
                    localStorage.setItem('cart', '[]')

                    //redirect to home page
                    window.location.assign('http://localhost:3001/home.html')


                }
                else {
                    console.log('data is null')
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //login failure

                $('#login-msg').css('background-color', 'red')
                $('#login-msg').html('<i class="fa fa-warning" style="font-size:16px"></i> Incorrect login credentials.')
                $('#login-msg').css('display', 'inline')
                setTimeout(function () { $("#login-msg").hide(); }, 3000);
                console.log('Error!')

            }
        })
        return false
    })
}

$(document).ready(function () {
    loginButton();
})