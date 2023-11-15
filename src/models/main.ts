import {createRealmContext} from '@realm/react'
import {User} from './user'

export const SchemaContext = createRealmContext({
    schema:[User],
})