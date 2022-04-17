import { Model } from "objection"
import PostModel from "./Post.js"
import UserModel from "./User.js"

class CommentModel extends Model {
    static tableName = "comments"
    static get relationMappings() {
        return {
            posts: {
                relation: Model.HasOneRelation,
                modelClass: PostModel,
                join: {
                    from: "comments.post_id",
                    to: "posts.id"
                }
            },
            users: {
                relation: Model.HasOneRelation,
                modelClass: UserModel,
                join: {
                    from: "comments.author_id",
                    to: "users.id"
                }
            },
        }
    }
}

export default CommentModel