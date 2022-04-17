import PostModel from "../models/Post.js"
import auth from "../middleware/authentification.js"
import CommentModel from "../models/Comment.js"

const PostRoute = ({app}) => {
    app.get("/posts/:id", async (req, res) => {
        const {
            params: {id}
        } = req

        const post = await PostModel.query()
            .findById(id)
            .select("posts.*", "users.pseudo as author")
            .leftJoinRelated("users")
            .orderBy("posts.createdAt", "desc")

        const comments = await CommentModel.query()
            .where({post_id: id})
            .select("comments.*", "users.pseudo as author")
            .leftJoinRelated("users")
            .orderBy("comments.createdAt", "desc")

        if (!post) {
            res.send({message: "post not found"})

            return
        }

        res.send({status: "OK", post: { ...post, comments : comments } })
    })
    app.post("/posts", async (req, res) => {
        const {
            body: {title, content, isPublished, author_id}
        } = req
        await PostModel.query().insert({
            title: title,
            content: content,
            isPublished: isPublished,
            //author_id: req.user.role_id try with middleware but not working
            author_id: author_id
        })
        res.send({message: "OK"})
    })
    app.put("/posts/:id", async (req, res) => {
        const {
            params: {id},
            body: {title, content, isPublished}
        } = req

        const post = PostModel.query().findById(id)

        if (!post) {
            res.send({message: "not found"})

            return
        }

        await PostModel.query().update({
            title: title,
            content: content,
            isPublished: isPublished,
        }).where({id})

        res.send({status: "OK"})
    })

    app.delete("/posts/:id", async (req, res) => {
        const {
            params: { id }
        } = req
        const post = PostModel.query().findById(id)

        if (!post) {
            res.send({status: "not found"})

            return
        }

        await PostModel.query().deleteById(id)

        res.send({status: "OK"})
    })

    app.get("/users/:id/posts", async (req, res) => {
        const {
            params: {id}
        } = req

        const posts = await PostModel.query()
            .select("posts.*", "users.pseudo as author", "users.id as authorId")
            .where({author_id: id})
            .leftJoinRelated("users")
            .orderBy("createdAt", "desc")

        res.send({message: "OK", posts: posts})
    })
    app.get("/posts", async (req, res) => {
        const posts = await PostModel.query()
            .select("posts.*", "users.pseudo as author")
            .leftJoinRelated("users")
            .where({isPublished: true})
            .orderBy("createdAt", "desc")

        res.send({status: "OK", posts: posts})
    })
}

export default PostRoute