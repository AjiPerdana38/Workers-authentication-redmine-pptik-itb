import http from 'http'
import connect from './database/index.js'

const requestListener = (request, response) => {
  response.setHeader('Content-Type', 'text/html')

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
