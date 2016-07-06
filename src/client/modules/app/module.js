import config from '../../config'
import Original from './themes/Original.scss'

const themes = {Original: Original}

export { default as View } from './AppPage'
export const css = themes[config.theme]
