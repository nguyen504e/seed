import connection from '../connections'
import { Role as RoleSchema } from '../schemas'
export default connection.model('Role', RoleSchema)
