/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateImage = (value: any) => {
  if (!value || value.length === 0) {
    return true; // Valor vazio é considerado válido
  }

  const allowedFormats = ['image/jpeg', 'image/png']; // Formatos permitidos
  const maxFileSize = 2 * 1024 * 1024; // Tamanho máximo de 2 MB (em bytes)

  for (let i = 0; i < value.length; i++) {
    const file = value[i];

    // Verifica o formato da imagem
    if (!allowedFormats.includes(file.type)) {
      return false; // Formato não permitido
    }

    // Verifica o tamanho da imagem
    if (file.size > maxFileSize) {
      return false; // Tamanho excede o limite máximo
    }
  }

  return true; // Imagem válida
};
