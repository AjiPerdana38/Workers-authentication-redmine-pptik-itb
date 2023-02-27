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

  channel.consume(queue, messages => {
    const data = messages.content.toString()
    const responseJson = JSON.parse(data)

    const { userId, username, phoneNumber, status, message, timestamp: date } = responseJson

    console.log(responseJson)
    channel.ack(messages)

    try {
      const schema = {
        userId,
        username,
        phoneNumber,
        status,
        message,
        date
      }

      if (responseJson.status === 'login') {
        const logLogin = new LogLogin(schema)
        logLogin.save()
      }

      if (responseJson.status === 'logout') {
        const logLogout = new LogLogout(schema)
        logLogout.save()
      }

      console.log('Data telah masuk kedalam database')

      notification(phoneNumber, 'Redmine', message)
    } catch (error) {
      console.log(error.message)
    }
  }, { noAck: false })
}

connected()
connect()
