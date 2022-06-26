import nanoid from 'nanoid'

export const generateFilePath = (fileType: string): string => {
  return `${nanoid()}.${fileType.split('/')[1]}`
}
