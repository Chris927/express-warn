import { Request, Response, NextFunction } from "express";
import { throttle } from "throttle-debounce";

type Options = {
  keyFn?: (req: Request) => string;
  warningFn?: (req: Request, res: Response) => Array<any> | undefined;
  log?: (...args: Array<any>) => void;
  throttleMillis?: number;
};

type ThrottledLogger = (...args: any[]) => void;

const throttledLoggers = new Map<string, ThrottledLogger>();

export default (options: Options = {}) => {
  const keyFn = options.keyFn || ((req: Request) => req.url);
  const throttleMillis = options.throttleMillis || 10 /* seconds */ * 1000;
  const warningFn = options.warningFn || (() => undefined); // TODO: does this make sense?
  const log =
    options.log ||
    ((...args: any[]): void => {
      console.log.apply(null, ["WARN", ...args]);
    });
  return function(req: Request, res: Response, next: NextFunction) {
    const key = keyFn(req);
    let throttledLogger = throttledLoggers.get(key);
    if (!throttledLogger) {
      throttledLogger = throttle(throttleMillis, log);
      throttledLoggers.set(key, throttledLogger);
    }
    const warning = warningFn(req, res);
    if (warning) {
      throttledLogger(...warning);
    }
    next();
  };
};
