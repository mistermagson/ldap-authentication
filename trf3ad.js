let config = {
    url: 'ldap://10.70.1.29', // Endereço do Servidor LDAP / AD
    baseDN: 'dc=trf3,dc=jus,dc=br',
}

let ActiveDirectory = require('activedirectory');

let ad = new ActiveDirectory(config);

let username = 'xxx'; // usar usuario@trf3.jus.br
let password = 'xxx'; //senha

ad.authenticate(username, password, function (err, auth) {
    if (err) {
        console.log('ERROR: ' + JSON.stringify(err));
        return;
    }

    if (auth) {
        console.log('Authenticated!');
    } else {
        console.log('Authentication failed!');
    }
});