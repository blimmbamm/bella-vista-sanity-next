import {createContext, useContext} from 'react'

export type SectionPreviewContextValue = {
  content?: Array<{_type?: string; children?: Array<{text?: string}>}>
  title?: string
}

export const SectionPreviewContext = createContext<SectionPreviewContextValue | null>(null)

export function useSectionPreviewValue() {
  return useContext(SectionPreviewContext)
}
