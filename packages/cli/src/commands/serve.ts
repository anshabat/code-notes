import { Command } from 'commander';

//<...> - mandatory argument from user
//[...] - optional argument form user
export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a fine for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action((filename = 'notebook.js', options) => {
    //logic after user run serve command
    console.log(filename, options);
  });
