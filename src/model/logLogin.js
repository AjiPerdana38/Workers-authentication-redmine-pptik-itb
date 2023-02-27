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
  status: {
    type: String
  },
  message: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('logs-logins', LogLogin)
