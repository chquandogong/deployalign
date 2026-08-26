import { createApp, log } from './app'
import { GEMINI_MODEL } from './gemini'

const port = Number(process.env.PORT ?? 8080)
const app = createApp()

const server = app.listen(port, '0.0.0.0', () => {
  log('service_started', {
    port,
    mode: process.env.NODE_ENV ?? 'development',
    liveGemini: process.env.ALLOW_LIVE_GEMINI === 'true',
    model: GEMINI_MODEL,
  })
})

process.on('SIGTERM', () => {
  log('service_stopping')
  server.close(() => process.exit(0))
})
