// DISPLAY USERS
async function displayUser() {
    let response = await fetch('http://localhost:3001/user');
    user = await response.json();
    console.log(user);
    let str = "";
    console.log(user.length);
    for(let i = 0; i < user.length; i++) {
        if(user[i] !== null) {
            str += `<tr>
            <td>${user[i].username}</td>
            <td>********</td>
            <td>${user[i].userType}</td>
            <td>${user[i].accessType}</td>
            <td>${user[i].userStatus}</td>
            <td>
                <span class="icon"><i class="fa fa-solid fa-edit" title="Edit" id="${user[i].username}-${user[i].password}-${user[i].userType}-${user[i].accessType}-${user[i].userStatus}" onclick="editUser(this)"></i></span>
			    <span class="icon"><i class="fa fa-solid fa-trash" title="Remove" id="${user[i].username}-${user[i].password}-${user[i].userType}-${user[i].accessType}-${user[i].userStatus}" onclick="deleteUser(this)"></i></span>
            </td>
            </tr>`
        }
    }
    document.getElementById('tBody').innerHTML = str;

    document.getElementById('userEdit').value = ''
    document.getElementById('passEdit').value = ''
    document.getElementById('userTypeEdit').value = ''
    document.getElementById('accessTypeEdit').value = ''
    document.getElementById('userStatusEdit').value = ''
}
async function editUser(data) {
    this.userId = data.id;
    console.log(this.userId);
    let userInfoSplit = data.id.split("-");
    document.getElementById('userEdit').value = userInfoSplit[0];
    document.getElementById('passEdit').value = userInfoSplit[1];
    document.getElementById('userTypeEdit').value = userInfoSplit[2];
    document.getElementById('accessTypeEdit').value = userInfoSplit[3];
    document.getElementById('userStatusEdit').value = userInfoSplit[4];
}
async function updateUser() {
    let userInfoSplit = this.userId.split("-");

    let userInfo = {
        username: document.getElementById('userEdit').value,
        password: document.getElementById('passEdit').value,
        userType: document.getElementById('userTypeEdit').value,
        accessType: document.getElementById('accessTypeEdit').value,
        userStatus: document.getElementById('userStatusEdit').value,
        loginAttempt: 3,
        // loginAttempt: 3
    }
    let response = await fetch(
        'http://localhost:3001/admin',
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
            body: JSON.stringify({username: userInfoSplit[0], password: userInfoSplit[1], userType: userInfoSplit[2], accessType: userInfoSplit[3], userStatus: userInfoSplit[4], loginAttempt:userInfoSplit[5], new_value: userInfo})
        }
    );
    response = await response.json();

    if (response.error) {
        console.log(error);
        alert("Something went wrong");
        return;
        // return clearFields();
    }
    alert("User updated successfully")
    console.log(userInfo);

    document.getElementById('userEdit').value = '';
    document.getElementById('passEdit').value = '';
    document.getElementById('userTypeEdit').value = 'CS';
    document.getElementById('accessTypeEdit').value = 'CS1';
    document.getElementById('userStatusEdit').value = 'ACT';

    displayUser();
}
async function deleteUser(data) {
    let userInfo = data.id.split("-");
    let response;
    console.log(userInfo)
    response = await fetch(
        'http://localhost:3001/admin',
        {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
            'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({username: userInfo[0]})
        }
    );
    response = await response.json();

    if(response.error) {
        return alert("something went wrong");
    }
    alert("Sucessfully deleted");

    displayUser();
    // clearFields();
    // displayUser();
}
async function addUser() {
    let userInfo = {
        username: document.getElementById('addUser').value,
        password: document.getElementById('password').value,
        userType: document.getElementById('addUserType').value,
        accessType: document.getElementById('addAccessType').value,
        userStatus: document.getElementById('addUserStatus').value,
        loginAttempt: '3'
    }
    let response;
    response = await fetch(
        'http://localhost:3001/user',
        {
            method: 'POST',
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
    response = await response.json();
    if (response.error) {
        alert("Something went wrong");
        return;
        // return clearFields();
    }
    alert("User added successfully")
    console.log(userInfo);
    // return clearFields();
    displayUser();
    document.getElementById('addUser').value = '';
    document.getElementById('password').value = '';
    document.getElementById('addUserType').value = 'CS';
    document.getElementById('addAccessType').value = 'CS1';
    document.getElementById('addUserStatus').value = 'ACT';
}
function btnModal() {
    let btnAdd = document.getElementById('addModal');
    btnAdd.style.display = "block";
}
function addClose() {
    let btnAdd = document.getElementById('addModal');
    btnAdd.style.display = "none";
}
displayUser();