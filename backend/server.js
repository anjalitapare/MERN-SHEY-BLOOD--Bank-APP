import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import bloodIssueRoutes from './routes/bloodIssueRoutes.js'
import bloodRequestRoutes from './routes/bloodRequestRoutes.js'
import bloodStoreRoutes from './routes/bloodStoreRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/blood-store', bloodStoreRoutes)
app.use('/api/blood-request', bloodRequestRoutes)
app.use('/api/blood-issue', bloodIssueRoutes)
app.use('/api/comment', commentRoutes)

// Set static folder
const __dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(
    `Server running ${process.env.NODE_ENV} mode on post ${PORT}`.yellow.bold
  )
)
