import UserModel from "../models/User.js"
import jsonwebtoken from "jsonwebtoken"

const SessionRoute = ({app}) => {
    app.post("/sign-up", async (req, res) => {
        const {
            body: { pseudo, email, password }
        } = req
        const user = await UserModel.query().findOne({email})

        if (!user) {
            const [hash, salt] = UserModel.getHashPassword(password)
            await UserModel.query().insert({
                pseudo: pseudo,
                email: email,
                passwordHash: hash,
                passwordSalt: salt,
                role_id: 1
            })

            res.status(200).send({status: "OK"})

            return
        }

        res.send({status: "NO", message: "email already used"})
    })

    app.post("/sign-in", async (req, res) => {
        const {
            body: { email, password }
        } = req
        const user = await UserModel.query().findOne({email})

        if (!user || !user.checkPassword(password)) {
            res.send({status: "NO"})

            return
        }

        const jwt = jsonwebtoken.sign(
            {
                payload: {
                    user: {
                        pseudo: user.pseudo,
                        email: user.email,
                        id: user.id,
                        role: user.role_id,
                        isSoftBan: user.isSoftBan
                    },
                },
            },
            process.env.JWT_SECRET,
            {expiresIn: "5 hours"}
        )

        res.send({status: "OK", auth: jwt, user: { id: user.id, pseudo: user.pseudo, role: user.role_id }})
    })
}

export default SessionRoute