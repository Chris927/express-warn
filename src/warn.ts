import { Request, Response, NextFunction } from 'express'

type Options = {
  keyFn: (req: Request) => any,
  mustWarnFn?: (v: any) => boolean,
  log?: (...args: any[]) => void
}

export default (options: Options) => {
  if (!options|| !options.keyFn) {
    throw new Error("'key' option is missing.")
  }
  const { keyFn } = options
  const warnFn = options.mustWarnFn || function(v: any) { return v ? true : false }
  const log = options.log || ((...args: any[]): void => console.log.apply(['WARN', ...args]))

  return function(req: Request, res: Response, next: NextFunction) {
    const value = keyFn(req)
    if (warnFn(value)) {
      log(value) // TODO: throttling
    }
    next()
  }
}