import mongoose from 'mongoose';
const Widget = mongoose.model('Widget');


// seed data if none exists
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
  api.get('/widget', (req, res) => {
    Widget.find().then(widgets =>
      res.json(widgets));
  });

  api.post('/widget', (req, res) => {
    Widget.create(req.body).then(createdWidget =>
      res.json(createdWidget));
  });

  api.put('/widget', (req, res) => {
    console.log(req.body);
    const {
      _id,
      ...updatedProps
    } = req.body;
    Widget.findByIdAndUpdate(_id, updatedProps).then(updatedWidget =>
      res.json(updatedWidget));
  });

  api.delete('/widget', (req, res) => {
    const {
      _id
    } = req.body;
    Widget.findByIdAndRemove(_id).then(() => res.json());
  });
};
