export const getValueType = (value: any): string => Object.prototype.toString.call(value).slice(8, -1)
export const isArray = (value: any): boolean => Array.isArray(value)
export const isObject = (value: any): boolean => getValueType(value) === 'Object'
