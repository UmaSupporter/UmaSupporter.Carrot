export async function fileToFormData(file: File) {
  return new FormData().append("files", file);
}
