"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const commander_1 = require("commander");
//<...> - mandatory argument from user
//[...] - optional argument form user
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]')
    .description('Open a fine for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action((filename = 'notebook.js', options) => {
    //logic after user run serve command
    console.log(filename, options);
});
