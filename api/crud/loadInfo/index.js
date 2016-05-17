export default api => {
  // Read
  api.get('/loadInfo', (req, res) =>
    res.json({
      message: 'This came from the api server',
      time: Date.now()
    })
  );
};
