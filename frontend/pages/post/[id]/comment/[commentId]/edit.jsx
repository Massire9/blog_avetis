import { useCallback, useContext, useEffect, useState } from "react"
import AppContext from "../../../../../src/components/AppContext"
import { Formik } from "formik"
import FormField from "../../../../../src/components/FormField"
import TextArea from "../../../../../src/components/TextArea"
import Button from "../../../../../src/components/Button"
import api from "../../../../../src/utils/api"

const EditComment = () => {
  const { session, router, editComment } = useContext(AppContext)
  const [comment, setComment] = useState(null)
  const { commentId } = router.query

  const handleFormSubmit = useCallback(
    async ({ content }) => {
      await editComment(content, comment.id)
      router.reload()
    },
    [router, comment, editComment]
  )

  useEffect(() => {
    if (!session) {
      return
    }

    if (!router.isReady) {
      return
    }

    api.get("/comments/" + router.query.commentId).then((res) => {
      const {
        data: { comment },
      } = res

      setComment(comment)
    })
  }, [router, commentId, session])

  return (
    <>
      {comment ? (
        <div className="flex flex-col items-center gap-y-8">
          <div className="text-2xl text-bold">Edit your comment : </div>
          <Formik
            initialValues={{ content: comment.content }}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, isSubmitting, isValid }) => (
              <form onSubmit={handleSubmit}>
                <FormField name="content" as={TextArea} />
                <Button
                  disabled={isSubmitting && !isValid}
                  className="w-auto self-center"
                  type="submit"
                >
                  Edit !
                </Button>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <div>Not found</div>
      )}
    </>
  )
}

export default EditComment
