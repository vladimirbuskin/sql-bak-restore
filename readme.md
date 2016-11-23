# NodeJS Sql server restore backup utility

Allows to restore sql server backup file (\*.bak)

Example:

```
sql-bak-restore <bakPath> <dbName> <oldDbName> <owner> [oldDbName_log]
``` 
!!! **sqlcmd** should respond, if it is not please install and make sure it's path withing PATH variable.

Arguments:

- bakpath, relative or absolute path to file
- dbName, to which database to restore
- oldDbName, what is logical database name (what name was when you did a backup)
- oldDbName_log, logical database log name (usually <oldDbName>+'_log', but sometimes different)
- owner, userName to make and give him db_owner privileges (password "1")

