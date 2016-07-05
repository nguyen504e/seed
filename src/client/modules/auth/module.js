import config from '../../config';

import Original from './styles/Original.scss'

const themes = {Original: Original}

export const css = themes[config.theme]
export { default as View } from './AuthPage';
