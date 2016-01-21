require('shelljs/global');

function restore()
{

  var fs = require('fs');
  var path = require('path');
  var argv = require('yargs').argv;
  var noArgv = argv._;

  if (noArgv.length < 4)
  {
    console.log("parameters: [bakPath] [dbName] [oldDbName] [owner]");
    return
  }

  var bakName = noArgv[0];
  var dbName  = noArgv[1];
  var oldDbName  = noArgv[2];
  var dbOwner = noArgv[3];
  var bakPath = path.isAbsolute(bakName) ? bakName : path.join(process.cwd(), bakName);

  
  if (!fs.existsSync(bakPath))
  {
    console.log("\"" + bakPath + "\" is not found, please specify correct file");
  }
  else  
  {
    var args = [
      '-v',
      'bakpath="'+bakPath+'"',
      'dbfld="'+path.dirname(bakPath)+'"',
      'dbname="'+dbName+'"',
      'oldDbName="'+oldDbName+'"',
      'dbowner="'+dbOwner+'"',
      '-E -i "'+path.join(__dirname,'restore.sql') + '"'
    ]

    var command = 'sqlcmd ' + args.join(' ');
    console.log(command);
    exec(command);
  }
}


module.exports = {
  restore: restore
};