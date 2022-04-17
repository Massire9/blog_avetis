import { Model } from "objection"
import UserModel from "./User.js"
import CommentModel from "./Comment.js"

class PostModel extends Model {
    static tableName = "posts"
    static get relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: UserModel,
                join: {
                    from: "posts.author_id",
                    to: "users.id"
                }
            },
            comments: {
                relation: Model.HasManyRelation,
                modelClass: CommentModel,
                join: {
                    from: "posts.id",
                    to: "comments.post_id"
                }
            },
        }
    }
}

export default PostModel