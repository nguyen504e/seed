import * as themes from './themes';

import config from '../../../config'

export { default as View } from './DashboardView';
export const css = themes[config.theme]
