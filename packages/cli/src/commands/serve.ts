import path from 'path';
import { Command } from 'commander';
import { serve } from 'local-api';

//<...> - mandatory argument from user
//[...] - optional argument form user
export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a fine for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action((filename = 'notebook.js', options: { port: string }) => {
    //logic after user run serve command
    const dir = path.join(process.cwd(), path.dirname(filename));
    serve(parseInt(options.port), path.basename(filename), dir);
  });
