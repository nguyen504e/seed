import util from 'util'

export default {
  REQUIRED: '%s can not be blank',
  IN_USED:  'This %s is already in use',
  required  (prop) {
    return this.format(this.REQUIRED, prop)
  },
  inUsed(prop) {
    return this.format(this.IN_USED, prop)
  },
  format() {
    return util.format(arguments)
  }
}
