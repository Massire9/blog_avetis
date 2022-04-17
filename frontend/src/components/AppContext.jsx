import { createContext, useCallback, useEffect, useState } from "react"
import api from "../utils/api"
import { useRouter } from "next/router"

const AppContext = createContext({})
export const AppContextProvider = (props) => {
  const [session, setSession] = useState(null)
  const [isLogged, setIsLogged] = useState(false)
  const router = useRouter()
  const initSession = useCallback((jwt) => {
    if (!jwt) {
      return
    }

    const [, payload] = jwt.split(".")
    const session = atob(payload)
    setSession(JSON.parse(session))
  }, [])

  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    initSession(jwt)
  }, [initSession])

  const signIn = useCallback(
    async (email, password) => {
      try {
        const {
          data: { auth, status },
        } = await api.post("/sign-in", { email, password })

        if (status === "OK") {
          localStorage.setItem("jwt", auth)
          initSession(auth)
          await router.push("/")
        }
      } catch (err) {
        return { error: err }
      }
    },
    [initSession, router]
  )

  const signUp = useCallback(
    async (pseudo, email, password) => {
      const {
        data: { status },
      } = await api.post("/sign-up", { pseudo, email, password })

      if (status === "OK") {
        await router.push("/sign-in")
      }
    },
    [router]
  )

  const logout = useCallback(() => {
    localStorage.clear()
    setSession(null)
    setIsLogged(false)
  }, [])

  const editAccount = useCallback(
    async (id, pseudo, email, password) => {
      const {
        data: { status },
      } = await api.put("/users/" + id, { pseudo, email, password })

      if (status === "OK") {
        await router.push("/")
      }
    },
    [router]
  )

  const deleteUser = useCallback(async (id) => {
    await api.delete("/users/" + id)
  }, [])

  const editAdmin = useCallback(async (role, id) => {
    const {
      data: { status },
    } = await api.put("/users/" + id + "/admin", { role })

    if (status === "OK") {
      return
    }
  }, [])

  const banUser = useCallback(async (id) => {
    const {
      data: { status },
    } = await api.put("/users/" + id + "/ban")

    if (status === "OK") {
      return
    }
  }, [])

  const createPost = useCallback(
    async (title, content, isPublished, author_id) => {
      const {
        data: { status },
      } = await api.post("/posts", {
        title,
        content,
        isPublished: !isPublished,
        author_id,
      })

      if (status === "OK") {
        return
      }
    },
    []
  )

  const editPost = useCallback(async (title, content, isPublished, id) => {
    const {
      data: { status },
    } = await api.put("/posts/" + id, {
      title,
      content,
      isPublished: !isPublished,
    })

    if (status === "OK") {
      return
    }
  }, [])

  const deletePost = useCallback(async (id) => {
    await api.delete("/posts/" + id)
  }, [])

  const createComment = useCallback(async (content, postId, userId) => {
    await api.post("/comments", {
      content,
      postId,
      userId,
    })
  }, [])
  const editComment = useCallback(async (content, id) => {
    await api.put("/comments/" + id, { content })
  }, [])

  return (
    <AppContext.Provider
      {...props}
      value={{
        signIn,
        signUp,
        logout,
        isLogged,
        session,
        router,
        editAccount,
        deleteUser,
        banUser,
        createPost,
        editAdmin,
        editPost,
        deletePost,
        createComment,
        editComment,
      }}
    />
  )
}

export default AppContext
