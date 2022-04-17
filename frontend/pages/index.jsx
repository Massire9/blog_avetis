import { useCallback, useContext, useEffect, useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from "yup"
import api from "../src/utils/api"
import AppContext from "../src/components/AppContext"
import FormField from "../src/components/FormField"
import Button from "../src/components/Button"
import TextArea from "../src/components/TextArea"
import Input from "../src/components/Input"
import Post from "../src/components/Post"

const IndexHome = () => {
  const { session, createPost, router } = useContext(AppContext)
  const [posts, setPosts] = useState([])
  const [id, setId] = useState(0)
  const handleFormSubmit = useCallback(
    async ({ title, content, isDraft }) => {
      await createPost(title, content, isDraft === 1, id)
      router.reload()
    },
    [createPost, id, router]
  )
  const postSchema = Yup.object()
    .shape({
      title: Yup.string().max(72).required("Required Field"),
      content: Yup.string().required("Required Field"),
    })
    .required()

  useEffect(() => {
    api.get("/posts").then((res) => {
      setPosts(res.data.posts)
    })
  }, [])
  useEffect(() => {
    if (!session) {
      return
    }

    setId(session.payload.user.id)
  }, [session])

  return (
    <>
      <div className="flex flex-col gap-y-2">
        {session &&
          session.payload.user.role !== 1 &&
          !session.payload.user.isSoftBan && (
            <div className="pt-16">
              <Formik
                initialValues={{ title: "", content: "", isDraft: 1 }}
                validationSchema={postSchema}
                onSubmit={handleFormSubmit}
              >
                {({ handleSubmit, isSubmitting, isValid }) => (
                  <form
                    className="flex flex-col items-center gap-y-7"
                    onSubmit={handleSubmit}
                  >
                    <div className="text-3xl">Create post !</div>

                    <FormField name="title" as={Input} placeholder="Title" />
                    <FormField
                      name="content"
                      as={TextArea}
                      placeholder="Content"
                    />
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
                      Post !
                    </Button>
                  </form>
                )}
              </Formik>
            </div>
          )}
        {posts.length > 0 ? (
          <div className="flex flex-col items-center gap-5">
            <div className="text-3xl">Latest posts !</div>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-2xl text-center text-red-500">
            There is no post :(
          </div>
        )}
      </div>
    </>
  )
}

export default IndexHome
