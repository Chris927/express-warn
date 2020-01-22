import { Request, Response, NextFunction } from "express";
import { throttle } from "throttle-debounce";

type Options = {
  keyFn: (req: Request) => any;
  mustWarnFn?: (v: any) => boolean;
  log?: (...args: any[]) => void;
  throttleMillis?: number;
};

export default (options: Options) => {
  if (!options || !options.keyFn) {
    throw new Error("'key' option is missing.");
  }
  const { keyFn } = options;
  const warnFn =
    options.mustWarnFn ||
    function(v: any) {
      return v ? true : false;
    };
  const log =
    options.log ||
    ((...args: any[]): void => console.log.apply(["WARN", ...args]));
  const throttleMillis = options.throttleMillis || 10 /* seconds */ * 1000;
  const throttledLogger = throttle(throttleMillis, log);
  return function(req: Request, res: Response, next: NextFunction) {
    const value = keyFn(req);
    if (warnFn(value)) {
      throttledLogger(value);
    }
    next();
  };
};
