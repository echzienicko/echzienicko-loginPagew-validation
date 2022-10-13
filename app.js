const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const sql = require("mssql");
const bodyParser = require('body-parser');
app.use(bodyParser.json());

/* db connection */
const config = {
    user: 'sa',                     //database UserName
    password: 'naruto*',            //database Password
    server: '192.168.1.53',         //IP ADDRESS
    database: 'CR_Management',      //Data basename
    trustServerCertificate: true
};

server.listen(3001, async () => {
    await sql.connect(config);
    global.request = new sql.Request();
    console.log('listening on *:3001', __dirname);
});

/* route */
app.use(express.static(__dirname.replace("crs-back-end", "") + 'crs-front-end/html'));
app.use(express.static(__dirname.replace("crs-back-end", "") + 'crs-front-end/css'));
app.use(express.static(__dirname + '/model'));
app.get('/login', (req, res) => {
    res.sendFile(__dirname.replace("crs-back-end", "") + 'crs-front-end/html/login.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname.replace("crs-back-end", "") + 'crs-front-end/html/crmadmin.html');
})

/*********************
 *        USERS      *
 ********************/
// DELETE QUERY
app.delete('/admin', async (req, res) => {
    const { body } = req;
    const { username } = body;
    try {
        const response = await request.query(`DELETE FROM CR_User WHERE username = '${username}'`);
        res.send(response);
    } catch (error) {
        res.send({ error: true });
    }
});
// UPDATE QUERY
app.put('/admin', async (req, res) => {
    const { body } = req;
    const { username, password, userType, accessType, userStatus, new_value } = body;
    const { username: newUsername, password: newPassword, userType: newUserType, accessType: newAccessType, userStatus: newUserStatus, loginAttempt: newLoginAttempt } = new_value;
    try {
        const response = await request.query(`UPDATE CR_User SET username = '${newUsername}', password = '${newPassword}', userType = '${newUserType}', accessType = '${newAccessType}', userStatus = '${newUserStatus}', loginAttempt = '${newLoginAttempt}' WHERE username = '${username}'`)
        res.send(response)
    } catch (error) {
        res.send({ error: true })
    }
})
// LOGIN USER QUERY
app.get('/user/:username', async (req, res) => {
    const { recordset } = await request.query(`SELECT * FROM CR_User WHERE username = '${req.params.username}'`);
    res.send({ recordset });
});
// UPDATE LOGIN ATTEMPS
app.put('/user/:username', async (req, res) => {
    const { loginAttempt, userStatus } = req.body;
    try {
        const response = await request.query(`UPDATE CR_User SET loginAttempt = ${loginAttempt}, userStatus = '${userStatus}'
        WHERE username = '${req.params.username}'`);
        res.send(response);
    } catch (error) {
        console.log({ error });
        res.send({ error: true });
    }
});
// DISPLAY USERS QUERY
app.get('/user', async (req, res) => {
    const { recordset } = await request.query(`SELECT * FROM CR_User WHERE userType <> 'Admin'`);
    res.send(recordset);
});
// ADD USER QUERY
app.post('/user', async (req, res) => {
    const { body } = req;
    const { username, password, userType, accessType, userStatus, loginAttempt } = body;
    try {
        const response = await request.query(`INSERT INTO CR_User(username, password, userType, accessType, userStatus, loginAttempt) VALUES ('${username}', '${password}', '${userType}', '${accessType}', '${userStatus}', '${loginAttempt}') `);
        res.send(response);
    } catch (error) {
        console.log({ error });
        res.send({ error: true });
    }
});