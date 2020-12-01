require('shelljs/global');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage')
const path = require('path');
const fs = require('fs');

const isLinux = process.platform !== "win32";
// const isWSL = require('fs').existsSync('/mnt/c');

const options = [
  { name: 'bak', type: String, defaultOption: true },
  { name: 'to', type: String },
  // credentials
  { name: 'server', alias: 'H', type: String },
  { name: 'login', alias: 'U', type: String },
  { name: 'password', alias: 'P', type: String },
  // database details
  { name: 'db', type: String },
  { name: 'dblog', type: String },
  { name: 'dbname', type: String },
  { name: 'dbuser', type: String },
  // help
  { name: 'help', alias: 'h', type: Boolean }
];
const sections = [
  {
    header: 'Restore SQL Server DB utility',
    content: `restores SQL-SERVER bak \n
examples:
sql-bak-restore -H 192.168.0.109 -U sa -P qwerty --bak "C:/temp/kansas.bak" --to "C:/temp/" --db kansas2 --dbname Wyoming --dblog Wyoming_log --dbuser mstar
`
  },
  {
    header: 'Options',
    optionList: options
  },
]

// check if no arguments sent
let emptyCount = 1;
if (process.argv[0].indexOf('/node')) {
  emptyCount++;
}
let isEmptyArgs = process.argv.length == emptyCount;

// show help
const opts = commandLineArgs(options);

function absPath(p) {
  if (isLinux) {
    p = p.replace(/[cC]:/g, '/mnt/c/');
    p = p.replace(/\\/g,'/');
  }
  console.log(p);
  if (!path.isAbsolute(p)) {
    p = path.join(process.cwd(), p);
  }
  return p;
}

// makes sure slashes are correct windows slashes
function properSlashes(p) {
  var reg = /[cCdDeEfF]:/g;
  if (reg.test(p)) {
    p = p.replace(/\//g,'\\');
  }
  return p;
}

function restore()
{
  // if no arguments or help, show help, and exit.
  if (isEmptyArgs || opts.help) {
    const usage = commandLineUsage(sections)
    console.log(usage);
    return;
  }

  var tmpDir = require('os').tmpdir();
  var tmpDirInScript = tmpDir;

  var bak = opts.bak;
  var to = opts.to;
  var login = opts.login;
  var password = opts.password;
  var db = opts.db;
  var dbuser = opts.dbuser;
  var dbname = opts.dbname;
  var dblog = opts.dblog || dbname + '_log';
  var dbpath = (to || path.dirname(bak));

  // if (isLinux) {
  //   bak = bak.replace(/[cC]:\\/g, '/mnt/c/');
  //   bak = bak.replace(/\\/g, '/');
  // }

  if (!fs.existsSync(absPath(bak)))
  {
    console.log("\"" + absPath(bak) + "\" is not found, please specify correct file");
  }
  else  
  {
    var query = `
    EXEC msdb.dbo.sp_delete_database_backuphistory @database_name = N'${db}'
    GO
    USE [master]
    GO
    ALTER DATABASE [${db}] SET  SINGLE_USER WITH ROLLBACK IMMEDIATE
    GO
    USE [master]
    GO
    DROP DATABASE [${db}]
    GO
    
    -- to view files withing bakpath
    RESTORE FILELISTONLY FROM DISK='${bak}'
    GO
    
    RESTORE DATABASE [${db}]
    FILE = N'${dbname}' 
    FROM DISK='${bak}' 
    WITH 
        FILE = 1,  
        MOVE N'${dbname}' TO N'${properSlashes(path.join(dbpath, db))}.mdf',
        MOVE N'${dblog}' TO N'${properSlashes(path.join(dbpath, db))}.ldf',
        NOUNLOAD,  
        STATS = 10
    GO
    
    
    CREATE LOGIN [${dbuser}] WITH PASSWORD='1'
    GO
    USE [${db}]
    GO
    DROP user [${dbuser}]
    GO
    CREATE USER [${dbuser}] FOR LOGIN [${dbuser}]
    GO
    USE [${db}]
    GO
    EXEC sp_addrolemember N'db_owner', N'${dbuser}'
    GO
    
    ALTER DATABASE ${db} SET MULTI_USER
    GO
    `
    
    var tempFilePath = require('os').tmpdir()+"/restore.js";
    require('fs').writeFileSync(tempFilePath, query);

    // get sql cmd
    var sqlCmd = !isLinux ? "sqlcmd" : `docker run -v "${tempFilePath}:${tempFilePath}" -i mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd`;

    // login credentials
    var server = opts.server || '';
    var login = opts.login || '';
    var password = opts.password || '';
    if (server) server = `-S ${server}`;
    if (login) login = `-U ${login}`;
    if (password) password = `-P ${password}`;

    //query = "select 1";
    // command


    var command = `${sqlCmd} ${server} ${login} ${password} -i ${tempFilePath}`;
    console.log(command);
    console.log(query);
    exec(command);
  }
}

// just to test
//restore();

module.exports = {
  restore: restore
};