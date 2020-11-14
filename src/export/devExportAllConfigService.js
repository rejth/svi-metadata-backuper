const fetch = require('node-fetch');
const fs = require('fs');

// to edit
const
    server = [
        'acme.rusfraudvi.rus.sas.com',
        'cyberdyne.rusfraudvi.rus.sas.com',
        'intech.rusfraudvi.rus.sas.com',
        'wigan.rusfraudvi.rus.sas.com',
        'hull.rusfraudvi.rus.sas.com',
        'york.rusfraudvi.rus.sas.com',
        'sutton.rusfraudvi.rus.sas.com',
        'arsenal.rusfraudvi.rus.sas.com',
        'chester.rusfraudvi.rus.sas.com',
        'wolves.rusfraudvi.rus.sas.com',
        'newcastle.rusfraudvi.rus.sas.com',
        'crystalpalace.rusfraudvi.rus.sas.com',
        'everton.rusfraudvi.rus.sas.com',
        'luton.rusfraudvi.rus.sas.com',
        'leeds.rusfraudvi.rus.sas.com',
        'cardiff.rusfraudvi.rus.sas.com',
        'bury.rusfraudvi.rus.sas.com',
        'oxford.rusfraudvi.rus.sas.com',
        'valencia.rusfraudvi.rus.sas.com',
        'skye.rusfraudvi.rus.sas.com',
        'liverpool.rusfraudvi.rus.sas.com',
        'sligo.rusfraudvi.rus.sas.com',
        'wem.rusfraudvi.rus.sas.com',
        'sheffield.rusfraudvi.rus.sas.com',
        'poole.rusfraudvi.rus.sas.com',
        'exeter.rusfraudvi.rus.sas.com',
        'corby.rusfraudvi.rus.sas.com'

    ],
    user = 'user',
    pass = 'pass';

function exportConfiguration() {
    // делаем экспорт конфигурации для каждого тенанта на сервере rusfraudvi.rus.sas.com
    server.forEach(function(tenant) {
        // авторизация на сервере
        fetch(`http://${tenant}/SASLogon/oauth/token?grant_type=password&username=${user}&password=${pass}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic c2FzLmVjOg=='
            }
        })
        .then(response => response.json())
        // экспорт конфигурации, ответ приходит в виде строки в "бинарном" виде
        .then(({access_token}) => fetch(`http://${tenant}/svi-transport/snapshot/export`, {
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
                let fileName = tenant.split('.')[0] + '-svi-configuration-' + dateExport + '.zip';
                fs.writeFile(fileName, content, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Finished!');
                });
            });
        });
    });
}
exportConfiguration();
