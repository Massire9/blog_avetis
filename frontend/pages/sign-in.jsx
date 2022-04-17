import { useCallback, useContext, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import AppContext from "../src/components/AppContext"
import FormField from "../src/components/FormField"
import ErrorMessage from "../src/components/ErrorMessage"
import Button from "../src/components/Button"

const SignIn = () => {
  const { signIn } = useContext(AppContext)
  const [displayErr, setDisplayErr] = useState(false)
  const handleFormSubmit = useCallback(
    async ({ email, password }) => {
      const result = await signIn(email, password)

      if (!result) {
        setDisplayErr(true)
      }
    },
    [signIn]
  )

  const signInSchema = Yup.object()
    .shape({
      email: Yup.string()
        .email("Invalid email")
        .max(255)
        .required("Required Field"),
      password: Yup.string().required("Required Field"),
    })
    .required()

  return (
    <>
      <ErrorMessage display={displayErr}>Incorrect credentials</ErrorMessage>
      <div className="flex flex-col p-4 rounded-lg border-2 border-black justify-center w-3/4 mx-auto my-5 items-center gap-y-10">
        <div className="text-3xl font-bold">Sign in</div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, isValid }) => (
            <form
              noValidate
              className="flex flex-col gap-y-7 items-center h-25 w-80"
              onSubmit={handleSubmit}
            >
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
                Connexion
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default SignIn
