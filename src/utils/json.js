import fs from 'fs'
import { Converter } from 'csvtojson'
import { zipObject, map, drop, isArray } from 'lodash'

export const jsonFromCvsFile = function(filename) {
  return new Promise((resolve, reject) => {
    const csvConverter = new Converter()
    csvConverter.on('end_parsed', resolve)
    csvConverter.on('error', reject)
    return fs.createReadStream(filename).pipe(csvConverter)
  })

}

export const jsonFromTable = function(data) {
  return isArray(data) ? map(drop(data), u => zipObject(data[0], u)) : []
}
