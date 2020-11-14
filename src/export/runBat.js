// Этот скрипт предназначен для автоматизированного запуска bat-скриптов, отвечающих за бэкап схем fdhdata, public и aiuserdata БД каждого тенанта на сервере rusfraudvi.rus.sas.com

// Подключение модулей:
// fs - модуль для работы с файловой системой ОС
// child_process - модуль для работы с процессами ОС
const fs = require('fs');
const {spawn} = require('child_process');

// Путь к директории, где лежат bat-скрипты для каждого тенанта
const path = 'C:/myfiles/backup_databases//';

// Массив папок в директории, каждая из которых названа в соответствии с именем тенанта
const listOfFolders = fs.readdirSync(path);

// Последовательный запуск bat-скриптов
listOfFolders.forEach(e => spawn('cmd.exe', ['/c', '/myfiles/backup_databases/' + e + '/backup_' + e + '.bat'])
    // Проверка успешности выполнения bat-скрипта. Статус 0 - успешно, 1 - ошибка
    .on('exit', e => {
        console.log(`Child exited with code ${e}`);
    })
);
