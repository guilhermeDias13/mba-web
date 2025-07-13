export function handleSeePassword(inputId: string) {
  const inputElementToSeePassword = document.getElementById(
    inputId
  ) as HTMLInputElement | null

  if (!inputElementToSeePassword) return

  if (inputElementToSeePassword.type === 'password') {
    inputElementToSeePassword.type = 'text'
  } else {
    inputElementToSeePassword.type = 'password'
  }
}
