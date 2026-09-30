import {Box, Text} from '@sanity/ui'
import type {PreviewProps} from 'sanity'
import {SectionPreviewCard} from './SectionPreviewCard'
import {extractPreviewText} from './extractPreviewText'
import {useSectionPreviewValue} from './SectionPreviewContext'

function excerpt(
  blocks: Parameters<typeof extractPreviewText>[0],
  maxLength: number,
  fallback: string,
) {
  const text = extractPreviewText(blocks, maxLength)
  return text === 'Empty' ? fallback : text
}

export function TextSectionPreview(_props: PreviewProps) {
  const section = useSectionPreviewValue()

  return (
    <SectionPreviewCard label="Text section">
      <Text size={1} style={{lineHeight: 1.5}}>
        {excerpt(section?.content, 140, 'No content yet')}
      </Text>
    </SectionPreviewCard>
  )
}

export function CalloutSectionPreview(_props: PreviewProps) {
  const section = useSectionPreviewValue()

  return (
    <SectionPreviewCard label="Callout section">
      <Box style={{borderLeft: '3px solid currentColor', paddingLeft: 12}}>
        <Text size={1} weight="semibold" style={{marginBottom: 6}}>
          {section?.title || 'Untitled callout'}
        </Text>
        <Text size={1} style={{lineHeight: 1.45}}>
          {excerpt(section?.content, 120, 'Add callout text…')}
        </Text>
      </Box>
    </SectionPreviewCard>
  )
}
