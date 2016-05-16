import mongoose, {Schema} from 'mongoose';


const widgetSchema = new Schema({
  color:                {type: String},
  sprocketCount:        {type: Number},
  owner:                {type: String},
  createdDate:          {type: Date, default: () => new Date()}
});


export default mongoose.model('Widget', widgetSchema);
