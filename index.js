let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let moment = require('moment');
//let Promise  = require('promise');

const dotenv = require('dotenv');
dotenv.config();

let config = {
    url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
    baseDN: process.env.LDAP_BASEDN,
}

app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());

let ActiveDirectory = require('activedirectory');

let ad = new ActiveDirectory(config);

app.get('/', function (req,res){
    res.status(200).send({success:'Tudo OK'});
});

app.post('/authenticate', function (req, res) {
    if(req.body.username && req.body.password) {
        ad.authenticate(req.body.username, req.body.password, function (err, auth) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }
            if (auth) {
                const token = generateAccessToken({username: req.body.username});

                res.json(token);//({token: token});
                console.log('Authenticated!');
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
app.get('/rota', authenticateToken, (req, res) => {
    res.status(200).send({success:'Rota autenticada'});
})

function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}

/*function getUserDetails(req, res, next) {
    return ad.findUser(req.body.username);
}*/

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