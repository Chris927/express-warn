import warn from './warn'

describe('warn', () => {
  it('fails without options', () => {
    // @ts-ignore
    expect(() => warn({})).toThrow(/missing/)
    // @ts-ignore
    expect(() => warn()).toThrow(/missing/)
  })
  it('succeeds with just the "key" option', () => {
    // @ts-ignore
    expect(typeof(warn({ keyFn: (r: Request) => r['bla'] }))).toBe('function')
  })
})
