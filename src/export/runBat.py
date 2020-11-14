# Этот скрипт предназначен для автоматизированного запуска bat-скриптов, отвечающих за бэкап схем fdhdata, public и aiuserdata БД каждого тенанта на сервере rusfraudvi.rus.sas.com

# Подключение модулей:
# os - модуль дял работы с файловой системой ОС
# subprocess - модуль для работы с процессами OC
import os
import subprocess

# Путь к директории, где лежат bat-скрипты для каждого тенанта
path = 'C:/myfiles/backup_databases//'

# Список папок в директории, каждая из которых названа в соответствии с именем тенанта
list_of_folders = os.listdir(r'{}'.format(path))

# Последовательный запуск bat-скриптов
for i in range(len(list_of_folders)):
    subprocess.call(r'{}'.format(path + list_of_folders[i] + '/' + '/backup_' + list_of_folders[i] + '.bat'))
