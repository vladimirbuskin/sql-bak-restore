# NodeJS Sql server restore backup utility

Allows to restore sql server backup file (\*.bak).
Good when you offen have to restore different databaseses, so it steamlines this procedure.

Install:
```
npm install -g sql-bak-restore
``` 

Usage:
```
sql-bak-restore <bakPath> <dbName> <oldDbName> <owner> [oldDbName_log]
``` 
!!! **sqlcmd** command line utility should respond, if it's not please add that to your PATH variable.

Arguments:

- bakpath, relative or absolute path to file
- dbName, to which database to restore (!! database with this name will be deleted if exists !!)
- oldDbName, database name (if you don't know, specify something and run, you will see available databases after run.)
- oldDbName_log, logical database log name (usually <oldDbName>+'_log', but sometimes different)
- owner, userName to make and give him db_owner privileges (password "1")



Example:
```
sql-bak-restore northwind.bak northwind northwind user1
``` 
