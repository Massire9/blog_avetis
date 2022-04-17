import { useCallback, useContext, useEffect, useState } from "react"
import { Formik, Field } from "formik"
import Link from "next/link"
import AppContext from "../../src/components/AppContext"
import Button from "../../src/components/Button"
import api from "../../src/utils/api"
import Post from "../../src/components/Post"

const Id = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(null)
  const { router, session, editAdmin, deleteUser, banUser } =
    useContext(AppContext)
  const { id } = router.query
  const handleDeleteClick = useCallback(
    async (id) => {
      await deleteUser(id)
      router.push("/")
    },
    [router, deleteUser]
  )
  const handleFormSubmit = useCallback(
    async ({ role }) => {
      await editAdmin(role, user.id)
      router.reload()
    },
    [router, editAdmin, user]
  )
  const handleBanClick = useCallback(
    async (id) => {
      await banUser(id)
      router.reload()
    },
    [router, banUser]
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    api.get("/users/" + id).then((res) => {
      const {
        data: { user },
      } = res
      setUser(user)
    })

    api.get("/users/" + id + "/posts").then((res) => {
      const {
        data: { posts },
      } = res
      setPosts(posts)
    })
  }, [id, router.isReady, session])

  if (!user) {
    return <div>Not found</div>
  }

  return (
    <>
      {user ? (
        <>
          <div className="flex flex-col rounded border-2 border-black mx-auto w-3/4 my-8 p-2">
            <div className="text-center text-2xl font-bold">My account</div>
            <div className="text-bold text-xl">Pseudo : {user.pseudo}</div>
            <div className="text-bold text-xl">E-mail : {user.email}</div>
            <div className="text-bold text-xl">Role : {user.role}</div>
            {session.payload.user.id === user.id && (
              <div className="flex gap-x-5 justify-end w-full">
                <Link href={"/profile/" + user.id + "/edit"}>
                  <a>
                    <Button className="bg-amber-600">Edit</Button>
                  </a>
                </Link>
                <Button>Delete</Button>
              </div>
            )}
            {session && session.payload.user.role === 3 && (
              <div className="text-xl border-2 border-black my-2 p-2">
                <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={{ role: user.role }}
                >
                  {({ handleSubmit, isSubmitting, isValid }) => (
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="role">
                        Admin - Role :
                        <Field
                          as="select"
                          name="role"
                          className="p-2 border-2 border-black rounded ml-5"
                        >
                          <option value={1}>Reader</option>
                          <option value={2}>Author</option>
                          <option value={3}>Admin</option>
                        </Field>
                      </label>
                      <Button
                        disabled={isSubmitting && !isValid}
                        className="bg-blue-200 ml-5 text-sm p-1 border-2 border-black shadow"
                        type="submit"
                      >
                        Edit Admin !
                      </Button>
                      <Link href={"/profile/" + user.id + "/edit"}>
                        <a>
                          <Button
                            className="bg-amber-600 text-sm p-1 border-2 border-black shadow"
                            disabled={isSubmitting && !isValid}
                          >
                            Edit
                          </Button>
                        </a>
                      </Link>
                      <Button
                        disabled={isSubmitting && !isValid}
                        onClick={() => handleDeleteClick(user.id)}
                        className="text-sm p-1 border-2 border-black shadow"
                      >
                        Delete
                      </Button>
                      <Button
                        disabled={isSubmitting && !isValid}
                        onClick={() => handleBanClick(user.id)}
                        className="text-sm p-1 border-2 border-black shadow"
                      >
                        {user.isSoftBan ? "Unban" : "Soft Ban"}
                      </Button>
                    </form>
                  )}
                </Formik>
              </div>
            )}
          </div>

          {session.payload.user.id === user.id && (
            <div className="flex flex-col mx-auto w-3/4 my-8 gap-y-2 items-center">
              <div className="text-center text-2xl font-bold">My posts</div>
              {posts ? (
                posts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <div>You didn't post yet</div>
              )}
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
export default Id
