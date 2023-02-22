import http from 'http'
import amqp from 'amqplib'
import connect from './database/index.js'
import LogLogin from './model/logLogin.js'
import { notification } from './utils/notifications.js'
import dotenv from 'dotenv'

dotenv.config()

const requestListener = (request, response) => {
  response.setHeader('Content-Type', 'text/html')

  const connected = async () => {
    const connection = await amqp.connect('amqp://redmine-dev:Er3d|01m!n3@rmq2.pptik.id:5672//redmine-dev')

    const channel = await connection.createChannel()
    const queue = 'redmine-logs'

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

  response.statusCode = 200
  response.end('<h1>Halo workers consume RabbitMq Redmine</h1>')
}

const server = http.createServer(requestListener)

const port = 5000
const host = 'localhost'

server.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`)
  connect()
})
