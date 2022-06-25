import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    //make sure cell storage file exists
    // if it does not exist, add in a default list of cells
    //read the file
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        //create a file and add default cells
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
    //parse a list of cells out of it
    //send list of cells back to browser
  });

  router.post('/cells', async (req, res) => {
    //make sure the file exists
    //if not, create it
    //take the list of cells from the request obj.
    //serialize them
    const { cells }: { cells: Cell[] } = req.body;
    //write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
