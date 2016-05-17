import mongoose from 'mongoose';
const Widget = mongoose.model('Widget');


// seed widgets data if none exists
Widget.find().then((widgetsArr) => {
  if(!widgetsArr.length)
    Widget.create([
      {id: 1, color: 'Red', sprocketCount: 7, owner: 'John'},
      {id: 2, color: 'Taupe', sprocketCount: 1, owner: 'George'},
      {id: 3, color: 'Green', sprocketCount: 8, owner: 'Ringo'},
      {id: 4, color: 'Blue', sprocketCount: 2, owner: 'Paul'}
    ]);
});

export default api => {
  // Create
  api.post('/widget', (req, res) => {
    Widget.create(req.body).then(createdWidget =>
      res.json(createdWidget));
  });

  // Read
  api.get('/widget', (req, res) => {
    Widget.find().then(widgets =>
      res.json(widgets));
  });

  // Update
  api.put('/widget', (req, res) => {
    const {
      _id,
      ...updatedProps
    } = req.body;
    Widget.findByIdAndUpdate(_id, updatedProps, {new: true}).then(updatedWidget =>
      res.json(updatedWidget));
  });

  // Delete
  api.delete('/widget', (req, res) => {
    const {_id} = req.body;
    Widget.findByIdAndRemove(_id).then(() => res.json());
  });
};
