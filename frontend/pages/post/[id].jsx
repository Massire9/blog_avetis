import { useCallback, useContext, useEffect, useState } from "react"
import { Formik } from "formik"
import moment from "moment"
import AppContext from "../../src/components/AppContext"
import FormField from "../../src/components/FormField"
import TextArea from "../../src/components/TextArea"
import api from "../../src/utils/api"
import Button from "../../src/components/Button"
import Comment from "../../src/components/Comment"

const Id = () => {
  const { session, router, createComment } = useContext(AppContext)
  const { id } = router.query
  const [post, setPost] = useState(null)

  const handleFormSubmit = useCallback(
    async ({ content }) => {
      await createComment(content, post.id, session.payload.user.id)
    },
    [createComment, post, session]
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    api.get("/posts/" + id).then((res) => {
      const {
        data: { status, post },
      } = res

      if (status === "OK") {
        setPost(post)
      }
    })
  }, [id, router])

  if (!post) {
    return <div>Not found !</div>
  }

  if (post.author_id !== session.payload.user.id && !post.isPublished) {
    return <div>Forbidden</div>
  }

  return (
    <>
      <div className="flex flex-col p-5 gap-y-2">
        <div className="flex flex-col">
          <div className="text-4xl font-bold">{post.title}</div>
          <div className="text-sm italic">
            by {post.author} {": "}
            {moment(post.createdAt).format("dddd DD MMMM yyyy - HH:mm")}
            {!post.isPublished && <div>Draft</div>}
          </div>
        </div>
        <div className="text-xl">{post.content}</div>
        {post.isPublished && !session.payload.user.isSoftBan && (
          <>
            <div>Write a comment : </div>
            <Formik initialValues={{ content: "" }} onSubmit={handleFormSubmit}>
              {({ handleSubmit, isSubmitting, isValid }) => (
                <form className="flex gap-x-2" onSubmit={handleSubmit}>
                  <FormField name="content" as={TextArea} />
                  <Button
                    disabled={isSubmitting && !isValid}
                    className="w-auto self-center"
                    type="submit"
                  >
                    Comment !
                  </Button>
                </form>
              )}
            </Formik>
            <div className="flex flex-col gap-y-8">
              <div className="text-3xl text-bold">Comments : </div>
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Id
