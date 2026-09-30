import {Button, Card, Text} from '@sanity/ui'
import {useState} from 'react'
import {definePlugin} from 'sanity'
import {Link} from 'sanity/router'

export const deployTool = definePlugin({
  name: 'deploy-tool',
  tools: [
    {
      name: 'deploy',
      title: 'Deploy Website',
      component: () => {
        const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

        async function handleDeployment() {
          try {
            setStatus('loading')

            const response = await fetch(process.env.SANITY_STUDIO_DEPLOY_HOOK!, {method: 'POST'})

            if (!response.ok) {
              throw new Error(`Deploy failed: ${response.status}`)
            }

            setStatus('success')
          } catch (err) {
            console.error(err)
            setStatus('error')
          }
        }

        return (
          <Card
            padding={4}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 'fit-content',
              gap: 16,
            }}
          >
            <Text size={2}>Trigger a new website deployment:</Text>

            <Button
              tone="primary"
              text={status === 'loading' ? 'Deploying…' : 'Deploy now'}
              onClick={handleDeployment}
              disabled={status === 'loading'}
            />

            {status === 'success' && <Text>✅ Deployment triggered successfully</Text>}

            {status === 'error' && <Text>❌ Failed to trigger deployment</Text>}

            {status !== 'idle' && (
              <Link
                href={process.env.SANITY_STUDIO_VERCEL_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                View progress on Vercel →
              </Link>
            )}
          </Card>
        )
      },
    },
  ],
})
