export default api => {
  // Simple /logout route.
  api.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.status(200).end();
  });
};
