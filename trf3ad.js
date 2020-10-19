let config = {
    url: 'ldap://xxxx', // Endereço do Servidor LDAP / AD
    baseDN: 'dc=trf3,dc=jus,dc=br',
}

let ActiveDirectory = require('activedirectory');

let ad = new ActiveDirectory(config);

let username = 'xxxx@trf3.jus.br'; // usar usuario@trf3.jus.br
let password = 'xxxx'; //senha


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


