import jsonwebtoken from "jsonwebtoken"
import UserModel from "../models/User.js"

const { JsonWebTokenError } = jsonwebtoken

const auth = async (res, req, next) => {
    const {
        headers: { authentication }
    } = req

    try {
        const {
            payload: {
                user: { email }
            }
        } = jsonwebtoken.verify(authentication, process.env.JWT_SECRET)

        req.user = await UserModel.query().findOne({ email })
        next()
    } catch(e) {
        if (e instanceof JsonWebTokenError) {
            res.status(401).send({ message: "NO" })

            return
        }

        res.status(500).send({ message: "internal server error" })
    }
}

export default auth