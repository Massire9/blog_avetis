import { useCallback, useContext, useState } from "react"
import { useRouter } from "next/router"
import { Formik } from "formik"
import * as Yup from "yup"
import AppContext from "../src/components/AppContext"
import FormField from "../src/components/FormField"
import ErrorMessage from "../src/components/ErrorMessage"
import Button from "../src/components/Button"

const SignUp = () => {
  const { signUp } = useContext(AppContext)
  const [displayErr, setDisplayErr] = useState(false)
  const signUpSchema = Yup.object().shape({
    pseudo: Yup.string()
      .matches("[a-zA-Z]", "No special characters allowed")
      .max(255)
      .required("Required Field"),
    email: Yup.string()
      .email("Invalid email")
      .max(255)
      .required("Required Field"),
    password: Yup.string().required("Required Field"),
  })

  const handleFormSubmit = useCallback(
    async ({ pseudo, email, password }, { resetForm }) => {
      const result = signUp(pseudo, email, password)

      if (result) {
        setDisplayErr(true)
        resetForm()
      }
    },
    [signUp]
  )

  return (
    <>
      <ErrorMessage display={displayErr}>Try later.</ErrorMessage>
      <div className="flex flex-col p-4 rounded-lg border-2 border-black justify-center w-3/4 mx-auto my-5 items-center gap-y-10">
        <div className="text-3xl font-bold">Join us</div>
        <Formik
          initialValues={{ pseudo: "", email: "", password: "" }}
          validationSchema={signUpSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, isValid }) => (
            <form
              noValidate
              className="flex flex-col gap-y-7 items-center h-25 w-80"
              onSubmit={handleSubmit}
            >
              <FormField name="pseudo" placeholder="Pseudo" />
              <FormField name="email" placeholder="E-mail" />
              <FormField
                name="password"
                placeholder="Password"
                type="password"
              />

              <Button
                disabled={isSubmitting && !isValid}
                className="self-center"
                type="submit"
              >
                Nous rejoindre !
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default SignUp
