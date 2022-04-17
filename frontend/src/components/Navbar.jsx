import Link from "next/link"
import { useCallback, useContext } from "react"
import AppContext from "./AppContext"
import { FiLogOut } from "react-icons/fi"
import { CgProfile } from "react-icons/cg"
const Navbar = () => {
  const { session, logout } = useContext(AppContext)
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  return (
    <>
      <div className="flex justify-between p-2 bg-black text-white">
        <div className="text-2xl">
          <Link href="/">Readflix</Link>
        </div>
        {!session ? (
          <div className="flex gap-2">
            <div className="border-2 border-white rounded-xl pr-2 pl-2 text-md">
              <Link href="/sign-in">
                <a>Sign-in</a>
              </Link>
            </div>
            <div className="border-2 border-white rounded-xl pr-2 pl-2 text-md">
              <Link href="/sign-up">
                <a>Sign-up</a>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="text-white align-bottom pt-1 text-2xl">
              <Link href={"/profile/" + session.payload.user.id}>
                <a>
                  <CgProfile />
                </a>
              </Link>
            </div>
            <div className="text-white align-bottom pt-1 text-2xl">
              <a href="/" onClick={handleLogout}>
                <FiLogOut />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
