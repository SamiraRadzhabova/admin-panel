export function SnakeCaseToLocalText(text: string, capitalize = false) {
  if (!capitalize) {
    const formattedWords =
      text.charAt(0).toUpperCase() +
      text.slice(1).toLowerCase().replace(/_/g, ' ');
    return formattedWords;
  } else {
    const words = text.split('_');
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
