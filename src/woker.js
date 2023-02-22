import amqp from 'amqplib'
import LogLogin from './model/logLogin.js'
import { notification } from './utils/notifications.js'
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

    console.table(responseJson)
    channel.ack(message)

    const logLogin = new LogLogin({
      userId: responseJson.userId,
      username: responseJson.username,
      phoneNumber: responseJson.phoneNumber,
      payload: {
        status: payload.status,
        message: payload.message
      },
      date: responseJson.timestamp
    })

    try {
      logLogin.save()
      console.log('Data telah masuk kedalam database')

      notification(responseJson.phoneNumber, 'Redmine', payload.message)
    } catch (error) {
      console.log(error.message)
    }
  }, { noAck: false })
}
connected()
