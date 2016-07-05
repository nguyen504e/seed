import config from '../../../config';

import Original from './styles/Original.scss'

const themes = {Original: Original}

export { default as View } from './LoginView';
export const css = themes[config.theme]
