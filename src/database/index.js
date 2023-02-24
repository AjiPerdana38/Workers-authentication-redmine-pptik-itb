import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', true)

const connect = async () => {
  try {
    await mongoose.connect('mongodb://redmine-dev:m!nEr3d|0O@database2.pptik.id:27017/redmine-dev')
    console.log('Successfull conntected to MongoDB')
  } catch (error) {
    console.log(error.message)
  }
}

export default connect
