import path from 'path';
import { Command } from 'commander';
import { serve } from '@ashab-jbook/local-api';

const isProduction = process.env.NODE_ENV === 'production';

//<...> - mandatory argument from user
//[...] - optional argument form user
export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a fine for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      //logic after user run serve command
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );

      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.error('Port is in use');
      } else {
        console.log('Hers the problem', err.message);
      }
      process.exit(1);
    }
  });
