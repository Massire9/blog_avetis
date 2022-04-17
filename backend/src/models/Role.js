import { Model } from "objection"

class RoleModel extends Model {
    static tableName = "roles"
    static get relationMappings() {
        return {
            roles: {
                relation: Model.BelongsToOneRelation,
                modelClass: RoleModel,
                join: {
                    from: "roles.id",
                    to: "users.role_id"
                }
            },
        }
    }
}

export default RoleModel