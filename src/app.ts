import express, { Application } from 'express'
import { startDatabase } from './database'
import { deleteMovie, getAllMovies, getMovieById, insertMovie, updateMovie } from './logic'
import { verifyId, verifyName } from './middleware'

const app : Application = express()
app.use(express.json())
app.use('/movies/:id', verifyId)

app.post('/movies', verifyName, insertMovie)

app.get('/movies', getAllMovies)

app.get('/movies/:id', getMovieById)

app.patch('/movies/:id', verifyName, updateMovie)

app.delete('/movies/:id', deleteMovie)

const port = Number(process.env.PORT) || 3000
app.listen(port, async () => {
    await startDatabase()
    console.log(`Application has started at http://localhost:${port}`)
})