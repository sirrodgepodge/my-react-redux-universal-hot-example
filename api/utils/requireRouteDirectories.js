import requireDir from 'require-dir';

export default (paths, api) => {
  // allow single path as string
  paths = typeof paths === 'string' ? [paths] : paths;
  paths.forEach(path => {
    // make relative to current file
    path = path[0] === '.' ? `../${path}` : path;

    const requiredDir = requireDir(path, {recurse: true});
    Object.keys(requiredDir).forEach(folderName => {
      requiredDir[folderName].index(api);
    });
  });
};
