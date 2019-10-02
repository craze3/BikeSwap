import { NextFunction, Request, Response } from "express"

export class HttpError extends Error {
  status?: number
  constructor(status: number, message?: string) {
    super()
    Object.setPrototypeOf(this, HttpError.prototype)
    if (status) this.status = status
    if (message) this.message = message
    this.stack = new Error().stack
  }
}

function handleSuccess(res: Response, result: any) {
  if (result === undefined) throw new HttpError(404, `Resource was not found`)

  if (typeof result === "object") {
    res.json(result)
  } else {
    res.send(result)
  }
}

function handleError(res: Response, error: any) {
  const responseBody: { error?: string; stack?: string } = {
    error: error.message ? error.message : error.toString(),
  }

  // if (process.env.NODE_ENV === 'development') {
  responseBody.stack = (error as Error).stack
  // }

  res.status(error.status ? error.status : 400)
  res.json(responseBody)
}

export type ActionOptions<T> = {
  request: Request
  response: Response
  next: NextFunction
  log: {
    error: (message: string) => void
  }
  query: <P extends keyof T>(name: P, required?: boolean) => T[P]
  body: any
  params: (name: string, required?: boolean) => any
  headers: (name: string, required?: boolean) => any
}

export function action(
  handler: (options: ActionOptions<any>) => any | Promise<any>,
): any {
  return (request: Request, response: Response, next: NextFunction) => {
    const handlerResult: any = handler({
      request,
      response,
      next,
      query(name: any, required?: boolean) {
        const value = request.query[name]
        if (value === undefined && required === true)
          throw new Error(`Query parameter "${name}" is required.`)

        return value
      },
      params(name: any, required?: boolean) {
        const value = request.params[name]
        if (value === undefined && required === true)
          throw new Error(`Parameter "${name}" is required.`)

        return value
      },
      headers(name: any, required?: boolean) {
        const value = request.headers[name]
        if (value === undefined && required === true)
          throw new Error(`Header "${name}" is required.`)

        return value
      },
      body: request.body,
      log: {
        error(message: string) {
          console.error(message)
        },
      },
    })
    if (handlerResult instanceof Promise) {
      return handlerResult
        .then(result => handleSuccess(response, result))
        .catch(error => handleError(response, error))
    } else {
      try {
        handleSuccess(response, handlerResult)
      } catch (error) {
        handleError(response, error)
      }
    }
    return handlerResult
  }
}
