type Options = {
  key: string,
  mustWarnFn?: (v: any) => boolean
}

export default (options: Options) => {
  if (!options|| !options.key) {
    throw new Error("'key' option is missing.")
  }

  return function() {} // TODO
}