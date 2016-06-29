import mongoose from 'mongoose'
export default new mongoose.Schema({
  _id:         String,
  description: String,
  active:      Boolean,
  permission:  [
    String
  ]
})
