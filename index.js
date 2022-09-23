let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let moment = require('moment');
//let Promise  = require('promise');

const dotenv = require('dotenv');
dotenv.config();

let config = {
    url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
    baseDN: process.env.LDAP_BASEDN,
    attributes: {
        user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName']
    }
}

app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());

let ActiveDirectory = require('activedirectory2');


app.get('/', function (req,res){
    res.status(200).send({success:'Tudo OK'});
});

app.post('/authenticate', function (req, res) {
    if(req.body.username && req.body.password) {

        config.username = req.body.username;
        config.password = req.body.password
        let ad = new ActiveDirectory(config);

        ad.authenticate(req.body.username, req.body.password, function (err, auth) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }
            if (auth) {

                const token = generateAccessToken({username: req.body.username});

                //busca demais dados do usuario autenticado
               /* ad.findUser(config.username, function(err, user) {
                    if (err) {
                        console.log('ERROR: ' +JSON.stringify(err));
                        return;
                    }

                    if (! user) console.log('User: ' + sAMAccountName + ' not found.');
                    else {
                        user.token = token;
                        res.json(user);
                    }

                });*/

                res.json(token);

            } else {
                console.log('Authentication failed!');
            }
        });
    } else {
        res.status(400).send({error: 'No username or password supplied'});
    }
});

//valida enviado o token no Body
//
app.post('/verify', function (req, res) {
    let token = req.body.token;
    if (token) {
        try {
            let decoded = jwt.decode(token, app.get(process.env.TOKEN));
            if (decoded.exp <= parseInt(moment().format("X"))) {
                return res.status(400).send({ error: 'Access token has expired'});
            } else {
                res.json(decoded.username);
            }
        } catch (err) {
            res.status(500).send({ error: 'Access token could not be decoded'});
        }
    } else {
        res.status(400).send({ error: 'Access token is missing'});
    }

});

// valida a rquisicao com BEARER Token
/*app.get('/user/:username', authenticateToken, (req, res) => {
    const {username} = res.params;
    const data = getUserDetails(username);
    res.status(200).send({data});
})*/
app.get('/user/:username',  (req, res) => {
    const {username} = req.params;
    console.log(req.params);
    const data = getUserDetails(username);
    const status = data ? 200 : 404;

    console.log(data);
    res.status(status).send({data});
})

function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}

function getUserDetails(username) {
    data = ad.findUser(username)
    return data;
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    //console.log(req)

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN, (err, user) => {

        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}

let port = (process.env.PORT || 3000);
app.listen(port, function() {
    console.log('Listening on port: ' + port);
/*
    if (typeof settings.ldap.reconnect === 'undefined' || settings.ldap.reconnect === null || settings.ldap.reconnect === false) {
        console.warn('WARN: This service may become unresponsive when ldap reconnect is not configured.')
    }*/
});