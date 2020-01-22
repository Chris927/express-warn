import warn from './warn'

describe('warn', () => {
  it('fails without options', () => {
    // @ts-ignore
    expect(() => warn({})).toThrow(/missing/)
    // @ts-ignore
    expect(() => warn()).toThrow(/missing/)
  })
  it('succeeds with just the "key" option', () => {
    expect(typeof(warn({ key: 'bla' }))).toBe('function')
  })
})