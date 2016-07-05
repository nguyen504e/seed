import Radio from 'backbone.radio'

// navigation
export const GlobalChannel = Radio.channel('global')

// For app only
export const AppChannel = Radio.channel('app')

// For auth task only
export const AuthChannel = Radio.channel('auth')
