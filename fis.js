/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

//kernel
var fis = module.exports = require('fis-kernel');

//merge standard conf
fis.config.merge({
    modules : {
        postprocessor : {
            js : 'jswrapper'
        },
        optimizer : {
            js : 'uglify-js',
            css : 'clean-css',
            htm : 'html-minifier',
            html : 'html-minifier'
        },
        packager : 'map'
    }
});

//exports cli object
fis.cli = {};

fis.cli.name = 'fis';

//colors
fis.cli.colors = require('colours');

//commander object
fis.cli.commander = null;

//package.json
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

//output help info
fis.cli.help = function(){
    var content = [
            '',
            '  Usage: ' + fis.cli.name + ' <command>',
            '',
            '  Commands:',
            ''
        ],
        prefix = 'fis-command-',
        prefixLen = prefix.length;
    
    //built-in commands
    var deps = {};
    //from package.json dependencies
    fis.util.merge(deps, fis.cli.info.dependencies);
    //traverse
    fis.util.map(deps, function(name){
        if(name.indexOf(prefix) === 0){
            name = name.substring(prefixLen);
            var cmd = fis.require('command', name);
            name = fis.util.pad(cmd.name || name, 12);
            content.push('    ' + name + (cmd.desc || ''));
        }
    });
    content = content.concat([
        '',
        '  Options:',
        '',
        '    -h, --help     output usage information',
        '    -v, --version  output the version number',
        '    --no-color     disable colored output',
        ''
    ]);
    console.log(content.join('\n'));
};

//output version info
fis.cli.version = function(){
    var content = [
        '',
        '  v' + fis.cli.info.version,
        '',
        ' __' + '/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'.bold.red + '__' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.yellow + '_____' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.green + '___',
        '  _' + '\\/\\\\\\///////////'.bold.red + '__' + '\\/////\\\\\\///'.bold.yellow + '____' + '/\\\\\\/////////\\\\\\'.bold.green + '_' + '       ',
        '   _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '______' + '\\//\\\\\\'.bold.green + '______' + '\\///'.bold.green + '__',
        '    _' + '\\/\\\\\\\\\\\\\\\\\\\\\\'.bold.red + '_________' + '\\/\\\\\\'.bold.yellow + '_______' + '\\////\\\\\\'.bold.green + '_________' + '     ',
        '     _' + '\\/\\\\\\///////'.bold.red + '__________' + '\\/\\\\\\'.bold.yellow + '__________' + '\\////\\\\\\'.bold.green + '______' + '    ',
        '      _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '_____________' + '\\////\\\\\\'.bold.green + '___' + '   ',
        '       _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '______' + '/\\\\\\'.bold.green + '______' + '\\//\\\\\\'.bold.green + '__',
        '        _' + '\\/\\\\\\'.bold.red + '______________' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.yellow + '_' + '\\///\\\\\\\\\\\\\\\\\\\\\\/'.bold.green + '___',
        '         _' + '\\///'.bold.red + '______________' + '\\///////////'.bold.yellow + '____' + '\\///////////'.bold.green + '_____',
        ''
    ].join('\n');
    console.log(content);
};

function hasArgv(argv, search){
    var pos = argv.indexOf(search);
    var ret = false;
    while(pos > -1){
        argv.splice(pos, 1);
        pos = argv.indexOf(search);
        ret = true;
    }
    return ret;
}

//run cli tools
fis.cli.run = function(argv){
    
    if(hasArgv(argv, '--no-color')){
        fis.cli.colors.mode = 'none';
    }
    
    var first = argv[2];
    if(argv.length < 3 || first === '-h' ||  first === '--help'){
        fis.cli.help();
    } else if(first === '-v' || first === '--version'){
        fis.cli.version();
    } else if(first[0] === '-'){
        fis.cli.help();
    } else {
        //register command
        var commander = fis.cli.commander = require('commander');
        var cmd = fis.require('command', argv[2]);
        cmd.register(
            commander
                .command(cmd.name || first)
                .usage(cmd.usage)
                .description(cmd.desc)
        );
        commander.parse(argv);
    }
};