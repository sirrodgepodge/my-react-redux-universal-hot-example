export default io => {
  io.on('connection', socket => {
    require('./crud')(socket);
    require('./edit')(socket);
    require('./exampleApp')(socket);
  });
};
