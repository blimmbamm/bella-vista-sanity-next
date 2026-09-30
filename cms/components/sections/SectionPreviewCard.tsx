import {Box, Flex, Text} from '@sanity/ui'
import type {ReactNode} from 'react'

type Props = {
  label: string
  children: ReactNode
}

export function SectionPreviewCard({label, children}: Props) {
  return (
    <Box margin={1} radius={2} overflow="hidden" style={{border: '1px solid var(--card-border-color)'}}>
      <Flex align="center" padding={2} style={{borderBottom: '1px solid var(--card-border-color)'}}>
        <Text size={0} weight="semibold">
          {label}
        </Text>
      </Flex>
      <Box padding={3}>{children}</Box>
    </Box>
  )
}
