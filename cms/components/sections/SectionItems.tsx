import type {ObjectItemProps} from 'sanity'
import {SectionPreviewContext, type SectionPreviewContextValue} from './SectionPreviewContext'

function contextFromValue(value: Record<string, unknown>): SectionPreviewContextValue {
  return {
    content: value.content as SectionPreviewContextValue['content'],
    title: value.title as string | undefined,
  }
}

function SectionItemProvider(props: ObjectItemProps) {
  const value = props.value as Record<string, unknown>

  return (
    <SectionPreviewContext.Provider value={contextFromValue(value)}>
      {props.renderDefault(props)}
    </SectionPreviewContext.Provider>
  )
}

export const TextSectionItem = SectionItemProvider
export const CalloutSectionItem = SectionItemProvider
