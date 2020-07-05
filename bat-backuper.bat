REM Создание резервных копий всех баз данных сервера rusfraudvi.rus.sas.com. Схемы fdhdata и public wzn5XiKxaHnLM2iMczbGtzcCwHmvgx9
CLS
ECHO OFF
CHCP 1251
REM Установка переменных окружения
SET PGBIN=C:\Program Files\PostgreSQL\11\bin
SET PGDATABASE=acme
SET PGHOST=rusfraudvi.rus.sas.com
SET PGPORT=5432
SET PGUSER=dbmsowner
SET PGPASSWORD=MXkyQzd2kFlGgbgTBjVwlC0Vm7eM2gC
SET FDHPATH=C:\myfiles\backup_databases\%PGDATABASE%\fdhdata\
SET PBLPATH=C:\myfiles\backup_databases\%PGDATABASE%\public\
SET AIUPATH=C:\myfiles\backup_databases\%PGDATABASE%\aiuserdata\
REM Смена диска и переход в папку из которой запущен bat-файл
%~d0
CD %~dp0
REM Формирование имени файлов резервных копий и файлов-отчетов
SET DATETIME=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2% %TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%
SET DUMPFILE=%PGDATABASE% %DATETIME%.sql
SET LOGFILE=%PGDATABASE% %DATETIME%.log
SET DUMPPATHFDH="%FDHPATH%%DUMPFILE%"
SET DUMPLOGFDH="%FDHPATH%%LOGFILE%"
SET DUMPPATHPBL="%PBLPATH%%DUMPFILE%"
SET DUMPLOGPBL="%PBLPATH%%LOGFILE%"
SET DUMPPATHAIU="%AIUPATH%%DUMPFILE%"
SET DUMPLOGAIU="%AIUPATH%%LOGFILE%"
REM Создание резервной копии
CALL "%PGBIN%\pg_dump.exe" --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% -n public %PGDATABASE% > %DUMPPATHPBL% 2>%DUMPLOGPBL%
CALL "%PGBIN%\pg_dump.exe" --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% -a -t "fdhdata.[^dh_]*" %PGDATABASE% > %DUMPPATHFDH% 2>%DUMPLOGFDH%
CALL "%PGBIN%\pg_dump.exe" --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% -n aiuserdata %PGDATABASE% > %DUMPPATHAIU% 2>%DUMPLOGAIU%
REM Анализ кода завершения
IF NOT %ERRORLEVEL%==0 GOTO Error
GOTO Successfull
REM В случае ошибки удаляется поврежденная резервная копия и делается соответствующая запись в журнале
:Error
ECHO %DATETIME% Ошибки при создании резервной копии базы данных %DUMPFILE%. Смотрите отчет %LOGFILE%. >> backup.log
GOTO End
REM В случае удачного резервного копирования делается запись в журнал
:Successfull
ECHO %DATETIME% Успешное создание резервной копии %DUMPFILE% >> backup.log
GOTO End
:End