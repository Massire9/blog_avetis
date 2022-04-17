import { useCallback, useContext, useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import AppContext from "../../../src/components/AppContext"
import FormField from "../../../src/components/FormField"
import ErrorMessage from "../../../src/components/ErrorMessage"
import Button from "../../../src/components/Button"

const AccountEdit = () => {
  const { router, session, editAccount } = useContext(AppContext)
  const { id } = router.query
  const [displayErr, setDisplayErr] = useState(false)
  const editAccountSchema = Yup.object().shape({
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
      const result = editAccount(id, pseudo, email, password)

      if (result) {
        resetForm()
      }
    },
    [editAccount, id]
  )

  return (
    <>
      <ErrorMessage display={displayErr}>Email already used.</ErrorMessage>
      <div className="flex flex-col p-4 rounded-lg border-2 border-black justify-center w-3/4 mx-auto my-5 items-center gap-y-10">
        <div className="text-3xl font-bold">Edit account</div>
        <Formik
          initialValues={{
            pseudo: "",
            email: "",
            password: "",
          }}
          validationSchema={editAccountSchema}
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
                Edit !
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default AccountEdit
