import { Request, Response } from 'express'
import { Movie, movieCreate } from './interface'
import { QueryConfig, QueryResult } from 'pg'
import { client } from './database'
import format from 'pg-format'

export const insertMovie = async (req: Request, res: Response): Promise<Response> => {
    const newMovie: movieCreate = req.body

    const queryString: string = `
        INSERT INTO "movies" ("name", "category", "duration", "price")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(newMovie),
    }

    const queryResult: QueryResult<Movie> = await client.query(queryConfig)
    const movie: Movie = queryResult.rows[0]

    return res.status(201).json(movie)
}

export const getAllMovies = async (req: Request, res: Response): Promise<Response>  => {
    const queryParams = req.query.category

    const queryString: string = `
        SELECT * 
        FROM "movies"
        WHERE "category" = $1;
    `
    const queryStringAll: string = `
        SELECT * 
        FROM "movies";
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [queryParams],
    }

    let queryResult: QueryResult<Movie> = await client.query(queryConfig)
    queryResult.rows.length === 0 ? queryResult = await client.query(queryStringAll) : null
    const movieList: Movie[] = queryResult.rows

    return res.status(200).json(movieList)
}

export const getMovieById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params

    const queryString = `
        SELECT *
        FROM "movies"
        WHERE "id" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }

    const queryResult: QueryResult<Movie> = await client.query(queryConfig)
    const movieList: Movie = queryResult.rows[0]

    return res.status(200).json(movieList)
}

export const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    const data = req.body
    const { id } = req.params

    const queryString: string = format(`
        UPDATE "movies"
        SET (%I) = ROW(%L)
        WHERE "id" = $1
        RETURNING *;`,
        Object.keys(data),
        Object.values(data)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }

    const queryResult: QueryResult<Movie> = await client.query(queryConfig)
    const movie: Movie = queryResult.rows[0]

    return res.status(200).json(movie)
}

export const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params

    const queryString: string = `
        DELETE FROM "movies"
        WHERE "id" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    }

    await client.query(queryConfig)
    
    return res.status(204).json()
}