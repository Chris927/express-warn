import { Request, Response, NextFunction } from "express";
import { throttle } from "throttle-debounce";

type Options = {
  keyFn?: (req: Request) => string;
  warningFn?: (req: Request, res: Response) => any[];
  log?: (...args: any[]) => void;
  throttleMillis?: number;
};

type ThrottledLogger = (...args: any[]) => void;

const throttledLoggers = new Map<string, ThrottledLogger>();

export default (options: Options = {}) => {
  const keyFn = options.keyFn || ((req: Request) => req.url);
  const warningFn = options.warningFn || (() => undefined);
  const log =
    options.log ||
    ((...args: any[]): void => console.log.apply(null, ["WARN", ...args]));
  return function(req: Request, res: Response, next: NextFunction) {
    const key = keyFn(req);
    let logger = throttledLoggers.get(key);
    if (!logger) {
      const throttleMillis = options.throttleMillis || 10 /* seconds */ * 1000;
      logger = throttle(throttleMillis, log);
      throttledLoggers.set(key, logger);
    }
    const warning = warningFn(req, res);
    if (warning) {
      logger(warning);
    }
    next();
  };
};
