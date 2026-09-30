type PageUrlInput = {
  language?: string | null
  path?: string | null
  isHome?: boolean | null
}

export function resolvePageUrl(page: PageUrlInput) {
  const language = page.language ?? 'en'

  if (page.isHome) {
    return `/${language}`
  }

  return `/${language}/${page.path ?? ''}`
}

export function parsePathParam(slug?: string[]) {
  return slug?.join('/') ?? ''
}
