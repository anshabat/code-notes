import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // replace index file code with users input code
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // Common code for css and js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // return cached results if we have args.path key in indexedDB
        const cachedResults = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // if return cachedResults, we wont go to next onLoad calls, so return cache
        // if return nothing, esbuild will go to next onLoad calls and fetch package
        if (cachedResults) {
          return cachedResults;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        //check if we have css file, escape it initial code and put into body
        const escaped = data
          .replace(/\n/g, "") //remove new line, put all css into one line
          .replace(/"/g, '\\"') //escape double quotes
          .replace(/'/g, "\\'"); //escape single quotes
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style)    
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //add fetched lib from unpackg into indexedDB for future fetching reduce
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //add fetched lib from unpackg into indexedDB for future fetching reduce
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
