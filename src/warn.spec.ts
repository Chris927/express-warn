import warn from "./warn";

describe("warn", () => {
  it("is okay without options", () => {
    // @ts-ignore
    expect(() => warn({})).toBeTruthy();
    // @ts-ignore
    expect(() => warn()).toBeTruthy();
  });
  it('succeeds with just the "key" option', () => {
    // @ts-ignore
    expect(typeof warn({ keyFn: (r: Request) => r["bla"] })).toBe("function");
  });
  it("logs", () => {
    const logger = jest.fn();
    const middleware = warn({
      log: logger,
      warningFn: req => (!req.query || !req.query.bla ? ["bla missing"] : [])
    });
    // @ts-ignore
    middleware({ url: "/test" }, {}, jest.fn()); // triggers warning
    // @ts-ignore
    middleware({ url: "/test", query: { bla: 42 } }, {}, jest.fn()); // does not trigger warning
    const { calls } = logger.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toEqual(["bla missing"]);
  });
  it("throttles", () => {
    const logger = jest.fn();
    const middleware = warn({ warningFn: () => ["warning..."], log: logger });
    for (let i = 0; i < 3; i++) {
      // @ts-ignore
      middleware({ bla: 42 }, {}, jest.fn());
    }
    const { calls } = logger.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toEqual(["warning..."]);
  });
});
