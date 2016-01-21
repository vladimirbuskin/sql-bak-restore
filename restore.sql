ALTER DATABASE $(dbname) SET SINGLE_USER WITH ROLLBACK IMMEDIATE 
GO 

RESTORE DATABASE $(dbname) FROM DISK='$(bakpath)' 
WITH REPLACE
GO

CREATE LOGIN mstar WITH PASSWORD='1'
GO
USE [$(dbname)]
GO
DROP user [$(dbowner)]
GO
CREATE USER [mstar] FOR LOGIN [$(dbowner)]
GO
USE [$(dbname)]
GO
EXEC sp_addrolemember N'db_owner', N'$(dbowner)'
GO

ALTER DATABASE $(dbname) SET MULTI_USER
GO
