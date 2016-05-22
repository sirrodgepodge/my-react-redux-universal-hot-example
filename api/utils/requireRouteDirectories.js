import requireDir from 'require-dir';

export default (paths, api) => {
  // allow single path as string
  paths = typeof paths === 'string' ? [paths] : paths;
  paths.forEach(path => {
    // make relative to current file
    path = path[0] === '.' ? `../${path}` : path;

    const requiredDir = requireDir(path, {recurse: true});

    // recurse through folders and pass api into those that export functions
    const objLoopFunc = (obj, func) => Object.keys(obj).forEach(prop => func(obj[prop]));

    const runIfFunc = folder => typeof folder === 'function' ?
      folder(api) :
      typeof folder === 'object' &&
      objLoopFunc(folder, runIfFunc);

    objLoopFunc(requiredDir, runIfFunc);
  });
};
