async function urlToFile(
  url: string,
  filename: string,
  mimeType: string
): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: mimeType })
}

export async function createFileListFromUrl(url: string): Promise<FileList> {
  const file = await urlToFile(url, 'image.jpg', 'image/jpeg')

  // Cria um objeto similar ao FileList usando DataTransfer
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)

  // Retorna o FileList
  return dataTransfer.files
}
