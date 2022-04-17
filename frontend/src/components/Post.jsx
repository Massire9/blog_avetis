import Link from "next/link"
import { useCallback, useContext } from "react"
import appContext from "./AppContext"
import moment from "moment"
import { AiFillEdit, AiFillDelete } from "react-icons/ai"

const Post = (props) => {
  const { session, router, deletePost } = useContext(appContext)
  const { post } = props

  const handleDeleteClick = useCallback(
    async (id) => {
      await deletePost(id)
      router.reload()
    },
    [router, deletePost]
  )

  return (
    <div className="flex flex-col w-3/4 border-2 border-black rounded p-3 hover:bg-red-400">
      <Link href={"/post/" + post.id}>
        <a className="text-xl font-bold hover:underline">{post.title}</a>
      </Link>
      <div>{post.content}</div>
      {!post.isPublished && (
        <div className="text-sm text-black italic">Draft</div>
      )}
      <div className="text-gray-600 text-sm self-end flex gap-x-2 italic">
        par {post.author} le{" "}
        {moment(post.createdAt).format("dddd DD MMM yyyy à HH:mm")}
        {session &&
        (session.payload.user.id === post.author_id ||
          session.payload.user.role === 3) ? (
          <div className="flex text-2xl">
            <Link href={"/post/" + post.id + "/edit"}>
              <a>
                <AiFillEdit className="hover:text:bg-red-700" />
              </a>
            </Link>
            <AiFillDelete
              className="hover:text:bg-red-700"
              onClick={() => handleDeleteClick(post.id)}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default Post
