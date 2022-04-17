import {pbkdf2Sync, randomBytes} from "crypto"
import {Model} from "objection"
import RoleModel from "./Role.js"
import CommentModel from "./Comment.js"
import PostModel from "./Post.js"
import config from "../config.js"

const {
    security: {
        password: {
            digest, keylen, iterations, saltSize
        }
    }
} = config

class UserModel extends Model {
    static tableName = "users"

    static get relationMappings() {
        return {
            role: {
                relation: Model.HasOneRelation,
                modelClass: RoleModel,
                join: {
                    from: "users.role_id",
                    to: "roles.id"
                }
            },
            posts: {
                relation: Model.HasManyRelation,
                modelClass: PostModel,
                join: {
                    from: "users.id",
                    to: "posts.author_id"
                }
            },
            comments: {
                relation: Model.HasManyRelation,
                modelClass: CommentModel,
                join: {
                    from: "users.id",
                    to: "comments.author_id"
                }
            },
        }
    }

    static getHashPassword = (password, salt = randomBytes(saltSize).toString("hex")) => [
        pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex"),
        salt,
    ]
    checkPassword = (password) => {
        const [hash] = UserModel.getHashPassword(password, this.passwordSalt)

        return hash === this.passwordHash
    }
}

export default UserModel