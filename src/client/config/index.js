import DefaultConfig from './default'
import RuntimeConfig from './runtime'
import UserConfig from './user'

const _RuntimeConfig = Object.create(DefaultConfig)

Object.assign(_RuntimeConfig, RuntimeConfig)

const _UserConfig = Object.create(_RuntimeConfig)

Object.assign(_UserConfig, UserConfig)

export default _UserConfig
