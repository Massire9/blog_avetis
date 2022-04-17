const Button = (props) => {
  const { className, ...restProps } = props

  return (
    <button
      className={"bg-red-700 w-24 p-2 rounded-md font-bold " + className}
      {...restProps}
    />
  )
}

export default Button
