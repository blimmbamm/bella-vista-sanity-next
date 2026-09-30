type BlockLike = {
  _type?: string
  children?: Array<{text?: string}>
}

export function extractPreviewText(blocks: BlockLike[] | undefined, maxLength = 80): string {
  if (!blocks?.length) {
    return 'Empty'
  }

  const text = blocks
    .filter((block) => block._type === 'block')
    .flatMap((block) => block.children?.map((child) => child.text ?? '') ?? [])
    .join(' ')
    .trim()

  if (!text) {
    return 'Empty'
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}
