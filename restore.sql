EXEC msdb.dbo.sp_delete_database_backuphistory @database_name = N'$(dbname)'
GO
USE [master]
GO
ALTER DATABASE [$(dbname)] SET  SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
USE [master]
GO
DROP DATABASE [$(dbname)]
GO


RESTORE DATABASE [$(dbname)]
FILE = N'$(oldDbName)' 
FROM DISK='$(bakpath)' 
WITH 
    FILE = 1,  
    MOVE N'$(oldDbName)' TO N'$(dbfld)\$(dbname).mdf',
    MOVE N'$(oldDbName)_log' TO N'$(dbfld)\$(dbname).ldf',
    NOUNLOAD,  
    STATS = 10
GO


CREATE LOGIN [$(dbowner)] WITH PASSWORD='1'
GO
USE [$(dbname)]
GO
DROP user [$(dbowner)]
GO
CREATE USER [$(dbowner)] FOR LOGIN [$(dbowner)]
GO
USE [$(dbname)]
GO
EXEC sp_addrolemember N'db_owner', N'$(dbowner)'
GO

ALTER DATABASE $(dbname) SET MULTI_USER
GO
