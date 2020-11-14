const fetch = require('node-fetch');
const fs = require('fs');

// to edit
const
    server = 'server',
    user = 'user',
    pass = 'pass';

function exportConfiguration() {
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
    // экспорт конфигурации, ответ приходит в виде строки в "бинарном" виде
    .then(({access_token}) => fetch(`http://${server}/svi-transport/snapshot/export`, {
        method: 'post',
        headers: {
            'Accept': 'application/zip',
            'Content-Type': 'application/vnd.sas.fcs.config.filter+json',
            'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
            'id': 'ConfigurationFilter',
            'includeall': true,
            'items': []
        })
    }))
    .then(response => {
        console.log(response);
        // создаем типизированный массив и получаем набор бинарных данных
        response.arrayBuffer()
        .then(function(buffer) {
            // создаем типизированное представление для доступа к данным в буфере и чтения данных из него
            let content = new Uint8Array(buffer);
            // получение и преобразование текущей даты для формирования имени выгружаемого файла
            let start = new Date();
            let month = ((start.getMonth() + 1) < 10) ? ('0' + (start.getMonth() + 1)) : (start.getMonth() + 1);
            let day = (start.getDate() < 10) ? ('0' + start.getDate()) : start.getDate();
            let dateExport = day + '.' + month + '.' + String(start.getFullYear()).slice(2);
            // чтение содержимого буфера и запись его данных в файл zip
            let fileName = server.split('.')[0] + '-svi-configuration-' + dateExport + '.zip';
            fs.writeFile(fileName, content, function (err) {
                if (err) {
                    throw err;
                }
                console.log('Finished!');
            });
        });
    });
}
exportConfiguration();
