import requireDir from 'require-dir';

export default (paths, api) => {
  // allow single path as string
  paths = typeof paths === 'string' ? [paths] : paths;
  paths.forEach(path => {
    // make relative to current file
    path = path[0] === '.' ? `../${path}` : path;

    const requiredDir = requireDir(path, {recurse: true});

    // if folder contains an "index" file and that file exports a functon, pass in api
    Object.keys(requiredDir).forEach(folderName => {
      typeof requiredDir[folderName].index === 'function' && requiredDir[folderName].index(api);
    });

    const objLoopFunc = (obj, func) => Object.keys(obj).forEach(prop => func(obj[prop]));

    const runIfFunc = folder => typeof folder.index === 'function' ?
      folder.index(api) :
      folder && objLoopFunc(folder, runIfFunc);

    objLoopFunc(requiredDir, runIfFunc);
  });
};
