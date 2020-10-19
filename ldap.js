const { authenticate } = require('ldap-authentication')

 const auth = async () => {

    let options = {
        ldapOpts: {
            url: 'ldap://www.zflexldap.com',
            // tlsOptions: { rejectUnauthorized: false }
        },
        userDn: 'uid=guest1,ou=users,ou=guests,dc=zflexsoftware,dc=com',
        userPassword: 'guest1password',
        userSearchBase: 'dc=zflexsoftware,dc=com',
        usernameAttribute: 'uid',
        username: 'guest1',
        // starttls: false
    }

    let user = await authenticate(options)
    console.log(user)
}

auth()
