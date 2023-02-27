import amqp from 'amqplib'
import LogLogin from './model/logLogin.js'
import LogLogout from './model/logLogout.js'
import { notification } from './utils/notifications.js'
import connect from './database/index.js'
import dotenv from 'dotenv'
dotenv.config()

const connected = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI)

  const channel = await connection.createChannel()
  const queue = process.env.RABBITMQ_QUEUE

  channel.assertQueue(queue, { durable: true })

  channel.consume(queue, message => {
    const data = message.content.toString()
    const responseJson = JSON.parse(data)
    const payload = JSON.parse(responseJson.payload)

    console.log(responseJson)
    console.log(payload)
    channel.ack(message)

    try {
      if (responseJson.status === 'login') {
        const logLogin = new LogLogin({
          userId: responseJson.userId,
          username: responseJson.username,
          phoneNumber: responseJson.phoneNumber,
          status: responseJson.status,
          payload: {
            status: payload.status,
            message: payload.message
          },
          date: responseJson.timestamp
        })
        logLogin.save()
      }

      if (responseJson.status === 'logout') {
        const logLogout = new LogLogout({
          userId: responseJson.userId,
          username: responseJson.username,
          phoneNumber: responseJson.phoneNumber,
          status: responseJson.status,
          payload: {
            status: payload.status,
            message: payload.message
          },
          date: responseJson.timestamp
        })
        logLogout.save()
      }

      console.log('Data telah masuk kedalam database')

      notification(responseJson.phoneNumber, 'Redmine', payload.message)
    } catch (error) {
      console.log(error.message)
    }
  }, { noAck: false })
}
connected()
connect()
