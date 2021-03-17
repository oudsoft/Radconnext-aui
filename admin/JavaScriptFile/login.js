module.exports = function ( jq ) {
    
    var theme = 'energyblue';

    function doRequestLogin(params) {
        return new Promise(function (resolve, reject) {
            var url = "/" + rootName + "/login";
            $.post(url, params, function (data) {
                resolve(data);
            }).fail(function (error) {
                console.log(JSON.stringify(error));
                reject(error);
            });
        });
    }

    function doUserlogin() {
        let username = $('#pUserName').val();
        if (username) {
            let password = $('#pPassword').val();
            let params = { username: username, password: password, type: loginType };
            doRequestLogin(params).then((resp) => {
                console.log(resp);
                if (resp.status.code === 200) {
                    localStorage.setItem('token', resp.token);
                    setTimeout(() => {
                        window.location.href = resp.url;
                    }, 500);
                } else if (resp.status.code === 210) {
                    alert('Sorry, your accout have some problem.');
                    setTimeout(() => {
                        window.location.href = resp.url;
                    }, 500);
                } else {
                    alert('Wrong Email and Password.');
                    $('#username').focus();
                }
            });
        } else {
            alert('Email not Empty allow.');
            $('#username').focus();
        }
    }

    function doCheckAuth() {
        return new Promise(function (resolve, reject) {
            let testURL = "/" + rootname + "/testauth";
            $.ajax({
                type: 'POST',
                url: testURL,
                headers: {
                    authorization: localStorage.getItem('token')
                }
            }).then(function (httpdata) {
                resolve(httpdata);
            });
        });
    }

    function doLogout() {
        localStorage.removeItem('token');
        $('#LogoutCommand').hide();
        let url = 'http://' + host + '/' + rootname + '/res/login.html';
        window.location.replace(url);
    }

};