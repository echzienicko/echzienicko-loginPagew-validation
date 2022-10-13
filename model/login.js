async function login() {
    let userStatus = 'ACT';
    let username = document.getElementById('usernameLogin').value;
    let password = document.getElementById('passwordLogin').value;
    let response = await fetch(`http://localhost:3001/user/${username}`);

    let { recordset } = await response.json();

    if(username.length === 0 || password.length === 0) {
        alert("Enter username & password")
    }
    else {
        if(recordset.length) {
            let { loginAttempt } = recordset[0];
            if (recordset[0].password === password) {
                if(recordset[0].userType === 'Admin') {
                    loginAttempt = 999;
                    let userInfo = {
                        username,
                        loginAttempt,
                        userStatus
                    };
                    updateUserStatus(userInfo);
                    alert("Logged in successfully");
                    window.location = 'admin';
                }
                else if (recordset[0].userStatus === 'ACT'){
                    loginAttempt = 3;
                    let userInfo = {
                        username,
                        loginAttempt,
                        userStatus
                    };
                    updateUserStatus(userInfo);
                    window.location = 'dashboard';
                    alert("Logged in successfully");
                } else {
                    alert("Your account is deactivated");
                }
            }
            else {
                if(loginAttempt > 0){
                    loginAttempt--;
                    let userInfo = {
                        username,
                        loginAttempt,
                        userStatus 
                    }
                    updateUserStatus(userInfo);
                    alert("Invalid password");
                }

                if (loginAttempt === 0) {
                    userStatus = 'DAC';
                    let userInfo = {
                        username,
                        loginAttempt,
                        userStatus
                    };
                    updateUserStatus(userInfo);
                    alert("Your account is deactivated");
                }
            }
        }
        else {
            alert("User doesn't exist");
        }
    }
}

async function updateUserStatus(userInfo){
    await fetch(
        `http://localhost:3001/user/${userInfo.username}`,
        {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
            'Content-Type': 'application/json' 
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(userInfo)
        }
    );
}