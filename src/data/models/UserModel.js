import connection from '../connections'
import { User as UserSchema } from '../schemas'
export default connection.model('User', UserSchema)
