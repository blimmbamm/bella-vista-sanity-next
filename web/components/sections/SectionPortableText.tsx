import {PortableText, PortableTextMarkComponentProps} from 'next-sanity'
import type {Link} from '../../src/sanity/types'
import {urlFor} from '../../src/sanity/sanityImageUrl'
import {resolveLocaleString} from '../../src/sanity/resolveLocaleString'
import type {PageSection} from './SectionRenderer'
import styles from './SectionPortableText.module.css'

type Content = Extract<PageSection, {_type: 'textSection'}>['content']
type ResolvedImageRef = Extract<NonNullable<Content>[number], {_type: 'imageRef'}>

type Props = {
  content: Content | undefined
  lang: string
}

export default function SectionPortableText({content, lang}: Props) {
  if (!content?.length) {
    return null
  }

  return (
    <PortableText
      value={content}
      components={{
        marks: {
          link: ({value, children}: PortableTextMarkComponentProps<Link>) => (
            <a className={styles.link} href={value?.href}>
              {children}
            </a>
          ),
        },
        block: {
          h2: ({children}) => <h2 className={styles.h2}>{children}</h2>,
          h3: ({children}) => <h3 className={styles.h3}>{children}</h3>,
          normal: ({children}) => <p className={styles.paragraph}>{children}</p>,
        },
        list: {
          bullet: ({children}) => <ul className={styles.list}>{children}</ul>,
          number: ({children}) => <ol className={styles.orderedList}>{children}</ol>,
        },
        types: {
          imageRef: ({value}: {value: ResolvedImageRef}) => {
            const image = value.image?.image
            if (!image?.asset) {
              return null
            }

            const alt = resolveLocaleString(value.image?.alt, lang)
            const caption = resolveLocaleString(value.image?.caption, lang)

            return (
              <figure className={styles.figure}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.image}
                  src={urlFor(image).width(1200).height(750).fit('crop').auto('format').url()}
                  srcSet={[640, 960, 1200, 1600]
                    .map(
                      (width) =>
                        `${urlFor(image)
                          .width(width)
                          .height(Math.round(width * 0.625))
                          .fit('crop')
                          .auto('format')
                          .url()} ${width}w`,
                    )
                    .join(', ')}
                  sizes="(min-width: 768px) 44rem, 100vw"
                  width={1200}
                  height={750}
                  alt={alt || ''}
                  loading="lazy"
                />
                {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
              </figure>
            )
          },
        },
      }}
    />
  )
}
