export async function fileToFormData(file: File) {
  const frmData = new FormData();
  frmData.append("file", file);
  return frmData;
}
