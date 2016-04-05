/**
 * Created by diogomartins on 4/4/16.
 */

Meteor.startup(function(){
    Accounts.config({
       forbidClientAccountCreation: true 
    });
});

LDAP_DEFAULTS.url = 'ldap://ldap.unirio.br';
LDAP_DEFAULTS.base = 'ou=people,dc=unirio,dc=br'; // basedn
