import {getDictionary} from '../../i18n/dictionary'
import {formatPrice} from '../../src/formatting'
import {resolveLocaleString} from '../../src/sanity/resolveLocaleString'
import {urlFor} from '../../src/sanity/sanityImageUrl'
import type {PageSection} from './SectionRenderer'
import SectionShell from './SectionShell'
import styles from './MenuSection.module.css'

type MenuSection = Extract<PageSection, {_type: 'menuSection'}>
type Category = NonNullable<MenuSection['categories']>[number]
type Dish = Category['dishes'][number]

type Props = {
  section: MenuSection
  lang: string
}

export default function MenuSectionBlock({section, lang}: Props) {
  const categories = (section.categories ?? []).filter((category) => category.dishes.length > 0)
  const t = getDictionary(lang)

  if (categories.length === 0) {
    return null
  }

  const anchorId = (category: Category) => `${section._key}-${category._id}`

  return (
    <SectionShell title={section.title} wide>
      {categories.length > 2 && (
        <nav className={styles.categoryNav} aria-label={t.categories}>
          {categories.map((category) => (
            <a key={category._id} href={`#${anchorId(category)}`} className={styles.chip}>
              {resolveLocaleString(category.title, lang)}
            </a>
          ))}
        </nav>
      )}

      <div className={styles.categories}>
        {categories.map((category) => {
          const description = resolveLocaleString(category.description, lang)

          return (
            <section key={category._id} id={anchorId(category)} className={styles.category}>
              <header className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>{resolveLocaleString(category.title, lang)}</h3>
                {description && <p className={styles.categoryDescription}>{description}</p>}
              </header>

              <ul className={styles.dishes}>
                {category.dishes.map((dish) => (
                  <DishCard key={dish._id} dish={dish} lang={lang} />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </SectionShell>
  )
}

function DishCard({dish, lang}: {dish: Dish; lang: string}) {
  const name = resolveLocaleString(dish.name, lang)
  const description = resolveLocaleString(dish.description, lang)
  const variants = (dish.variants ?? []).filter((variant) => typeof variant.price === 'number')
  const image = dish.image?.asset ? dish.image : null

  return (
    <li className={styles.dish} data-has-image={image ? true : undefined}>
      {image && (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.image}
            src={urlFor(image).width(640).height(440).fit('crop').auto('format').url()}
            srcSet={`${urlFor(image).width(480).height(330).fit('crop').auto('format').url()} 480w, ${urlFor(image).width(960).height(660).fit('crop').auto('format').url()} 960w`}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            width={640}
            height={440}
            alt={resolveLocaleString(dish.image?.alt, lang) ?? ''}
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.dishBody}>
        <div className={styles.dishHeading}>
          <h4 className={styles.dishName}>{name}</h4>
          {variants.length === 0 && typeof dish.price === 'number' && (
            <span className={styles.price}>{formatPrice(dish.price, lang)}</span>
          )}
        </div>

        {description && <p className={styles.dishDescription}>{description}</p>}

        {variants.length > 0 && (
          <ul className={styles.variants}>
            {variants.map((variant) => (
              <li key={variant._key} className={styles.variant}>
                <span>{resolveLocaleString(variant.label, lang)}</span>
                <span className={styles.price}>{formatPrice(variant.price as number, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}
