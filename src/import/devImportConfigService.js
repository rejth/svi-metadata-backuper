const fetch = require('node-fetch');
const fs = require('fs');

// to edit
const
    server = 'server',
    user = 'user',
    pass = 'pass';

function importConfiguration() {
    // to edit
    let data = fs.readFileSync(`path/to/zip-archive`)
    // авторизация на сервере
    fetch(`http://${server}/SASLogon/oauth/token?grant_type=password&username=${user}&password=${pass}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic c2FzLmVjOg=='
        }
    })
    .then(response => response.json())
    // импорт конфигурации
    .then(({access_token}) => fetch(`http://${server}/svi-transport/snapshot/import`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/vnd.sas.fcs.config.filter+json',
            'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
            'id': 'ConfigurationFilter',
            'includeall': true,
            'items': [],
            'zipdata': Array.from(new Uint8Array(data))
        })
    }));
}
importConfiguration();
