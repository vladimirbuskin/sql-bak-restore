require('shelljs/global');

function restore()
{

  var fs = require('fs');
  var path = require('path');
  var argv = require('yargs').argv;
  var noArgv = argv._;

  var bakName = noArgv[0] || "p.bak";
  var dbName  = noArgv[1] || "p";
  var dbOwner = noArgv[2] || "mstar";

  var bakPath = path.isAbsolute(bakName) ? bakName : path.join(process.cwd(), bakName);
  console.log(bakPath);
  console.log(fs.exists(bakPath));
  if (fs.existsSync(bakPath))
  {
    var args = [
      '-v',
      'bakpath="'+bakPath+'"',
      'dbfld="'+path.dirname(bakPath)+'"',
      'dbname="'+dbName+'"',
      'dbowner="'+dbOwner+'"',
      '-E -i restore.sql'
    ]

    var command = 'sqlcmd ' + args.join(' ');
    console.log(command);
    exec(command);
  }
  else 
  {
    console.log("\"" + bakPath + "\" is not found, please specify correct file\n"+
      "parameters: [bakPath] [dbName] [owner]"
    );
  }

}


module.exports = {
  restore: restore
};