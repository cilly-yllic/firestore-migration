import { isArray, isObject } from '../types.js'
export const chunk = <T = unknown>(list: T[], size: number): T[][] =>
  list.reduce(
    (acc: T[][], _: T, i: number, self: T[]) => (i % size ? acc : [...acc, self.slice(i, i + size)]),
    [] as T[][]
  ) as T[][]

type Sort = 'DESC' | 'ASC'
type Result = -1 | 0 | 1

const getSortValue = (sort: Sort, val: Result): Result => (sort === 'ASC' ? val : val * -1) as Result

const compare = (a: any, b: any, key: string, sort: Sort): Result => {
  if (a[key] === b[key]) {
    return 0
  }
  if (isObject(a[key]) || isObject(b[key])) {
    return 1
  }
  return getSortValue(sort, a[key] > b[key] ? 1 : -1)
}

export interface MultiSortKey {
  key: string
  order: Sort
}

export const getMultiSort = <T = any>(list: T[], keys: MultiSortKey[]): T[] => {
  if (!isArray(list)) {
    return list
  }
  return [...list].sort((a, b) => {
    let value = 0
    for (const { key, order } of keys) {
      value = compare(a, b, key, order)
      if (value !== 0) {
        break
      }
    }
    return value
  })
}
