export const convertJSONToFunctions = (map: any={}) => {
  const newFuns: any = {}
  Object.keys(map).forEach((key) => {
    const item = map[key]
    newFuns[key] = new Function(...item.params, `${item.content}`)
  })
  return newFuns
};
