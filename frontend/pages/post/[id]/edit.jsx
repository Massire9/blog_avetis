import { useCallback, useContext, useEffect, useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from "yup"
import api from "../../../src/utils/api"
import AppContext from "../../../src/components/AppContext"
import FormField from "../../../src/components/FormField"
import Button from "../../../src/components/Button"
import TextArea from "../../../src/components/TextArea"
import Input from "../../../src/components/Input"

const EditPost = () => {
  const { session, editPost, router } = useContext(AppContext)
  const [post, setPost] = useState(null)
  const { id } = router.query
  const handleFormSubmit = useCallback(
    async ({ title, content, isDraft }) => {
      await editPost(title, content, isDraft === 1, id)
      router.reload()
    },
    [editPost, id, router]
  )
  const postSchema = Yup.object()
    .shape({
      title: Yup.string().max(72).required("Required Field"),
      content: Yup.string().required("Required Field"),
    })
    .required()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    api.get("/posts/" + id).then((res) => {
      setPost(res.data.post)
    })
  }, [id, router, router.isReady])

  return (
    <>
      {post && session.payload.user.id === post.author_id ? (
        <div className="pt-16">
          <Formik
            initialValues={{
              title: post.title,
              content: post.content,
              isDraft: 1,
            }}
            validationSchema={postSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, isSubmitting, isValid }) => (
              <form
                className="flex flex-col items-center gap-y-7"
                onSubmit={handleSubmit}
              >
                <div className="text-3xl">Edit post !</div>

                <FormField name="title" as={Input} placeholder="Title" />
                <FormField name="content" as={TextArea} placeholder="Content" />
                <label htmlFor="role">
                  Save as Draft
                  <Field
                    as="select"
                    name="isDraft"
                    className="p-2 border-2 border-black rounded ml-5"
                  >
                    <option value={1}>yes</option>
                    <option value={2}>no</option>
                  </Field>
                </label>
                <Button
                  disabled={isSubmitting && !isValid}
                  className="self-center"
                  type="submit"
                >
                  Edit !
                </Button>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <div>Forbidden</div>
      )}
    </>
  )
}

export default EditPost
