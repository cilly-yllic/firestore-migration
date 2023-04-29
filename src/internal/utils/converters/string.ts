export const camelCase = (txt: string) =>
  `${txt.charAt(0).toLowerCase()}${txt.slice(1)}`.replace(/[-_](.)/g, (_, group1) => group1.toUpperCase())

export const kebabCase = (txt: string): string => camelCase(txt).replace(/[A-Z]/g, s => `-${s.charAt(0).toLowerCase()}`)
