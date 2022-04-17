import classNames from "classnames"

const ErrorMessage = (props) => {
  const { display, ...restProps } = props

  return (
    <div
      className={classNames(
        "w-full bg-red-600 text-black h-8 font-bold text-xl text-center",
        {
          hidden: !display,
        }
      )}
      {...restProps}
    />
  )
}

export default ErrorMessage
