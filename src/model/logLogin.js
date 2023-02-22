import mongoose from 'mongoose'
const { Schema } = mongoose

const LogLogin = new Schema({
  userId: {
    type: String
  },
  username: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  payload: {
    status: {
      type: Number
    },
    message: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('log-logins', LogLogin)
