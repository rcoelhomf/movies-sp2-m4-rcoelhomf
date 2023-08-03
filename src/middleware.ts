import { NextFunction, Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from './database'
import { Movie } from './interface'

export const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const queryString: string = `
        SELECT * 
        FROM "movies"
        WHERE "id" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString, 
        values: [id],
    }

    const queryResult: QueryResult = await client.query(queryConfig)
    queryResult.rows.length === 0 ? (res.status(404).json({
        message: "Movie not found!"
    })) : next()
}

export const verifyName = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body

    const queryString: string = `
        SELECT *
        FROM "movies"
        WHERE "name" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name],
    }

    const queryResult: QueryResult<Movie> = await client.query(queryConfig)
    queryResult.rows.length === 0 ? next() : (res.status(409).json({
        message: "Movie name already exists!"
    }))
}