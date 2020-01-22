import warn from "./warn";

describe("warn", () => {
  it("fails without options", () => {
    // @ts-ignore
    expect(() => warn({})).toThrow(/missing/);
    // @ts-ignore
    expect(() => warn()).toThrow(/missing/);
  });
  it('succeeds with just the "key" option', () => {
    // @ts-ignore
    expect(typeof warn({ keyFn: (r: Request) => r["bla"] })).toBe("function");
  });
  it("logs", () => {
    const logger = jest.fn();
    const middleware = warn({ keyFn: (r: any) => r.bla, log: logger });
    // @ts-ignore
    middleware({ bla: 42 }, {}, jest.fn());
    const { calls } = logger.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(42);
  });
  it("throttles", () => {
    const logger = jest.fn();
    const middleware = warn({ keyFn: (r: any) => r.bla, log: logger });
    for (let i = 0; i < 3; i++) {
      // @ts-ignore
      middleware({ bla: 42 }, {}, jest.fn());
    }
    const { calls } = logger.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(42);
  });
});
