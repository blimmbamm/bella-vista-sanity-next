import { groq } from "next-sanity";

export const metadataQuery = groq`
  *[_type == "metadata" && language == $lang][0]
`;

export const pathsQuery = groq`
  *[_type == "page" && defined(language)]{
    language,
    path,
    isHome
  }
`;

/** Every page with its translations, used for the language switch in the header. */
export const pageTranslationsQuery = groq`
  *[_type == "page" && defined(language)]{
    language,
    path,
    isHome,
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{
        language,
        path,
        isHome
      }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    businessName,
    ownerName,
    address,
    phone,
    email,
    vatId,
    mapsUrl,
    socialLinks[]{
      _key,
      platform,
      url
    }
  }
`;

export const openingHoursQuery = groq`
  *[_type == "openingHours"][0]{
    weeklyHours[]{
      _key,
      day,
      closed,
      slots[]{ _key, opens, closes }
    },
    exceptions[]{
      _key,
      date,
      label,
      closed,
      slots[]{ _key, opens, closes }
    },
    note
  }
`;

const navLinkProjection = `{
  type,
  hash,
  href,
  openInNewTab,
  page->{
    _id,
    title,
    path,
    isHome,
    language
  }
}`;

export const navigationQuery = groq`
  *[_type == "navigation" && language == $lang][0]{
    _id,
    title,
    language,
    items[]{
      _key,
      label,
      link${navLinkProjection},
      children[]{
        _key,
        label,
        link${navLinkProjection},
        children[]{
          _key,
          label,
          link${navLinkProjection}
        }
      }
    }
  }
`;

/** Portable Text in sections: expand shared image refs for rendering. */
const sectionContentProjection = `
  []{
    ...,
    _type == "imageRef" => {
      ...,
      image->{
        _id,
        title,
        image,
        alt,
        caption
      }
    }
  }
`;

const menuCategoryProjection = `{
  _id,
  title,
  description,
  "dishes": *[_type == "dish" && category._ref == ^._id && available != false]
    | order(sortOrder asc){
      _id,
      name,
      description,
      price,
      variants[]{ _key, label, price },
      image{ asset, hotspot, crop, alt }
    }
}`;

export const pageByPathQuery = groq`
  *[
    _type == "page" &&
    language == $lang &&
    (
      ($path == "" && isHome == true) ||
      ($path != "" && path == $path && isHome != true)
    )
  ][0]{
    _id,
    title,
    seoTitle,
    description,
    path,
    isHome,
    language,
    sections[]{
      _key,
      _type,
      title,
      _type == "textSection" => {
        content${sectionContentProjection}
      },
      _type == "calloutSection" => {
        content${sectionContentProjection}
      },
      _type == "menuSection" => {
        "categories": select(
          count(categories) > 0 => categories[]->${menuCategoryProjection},
          *[_type == "menuCategory"] | order(sortOrder asc)${menuCategoryProjection}
        )
      },
      _type == "openingHoursSection" => {
        showExceptions
      },
      _type == "contactSection" => {
        showMap
      }
    },
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[]{
        language,
        "page": value->{
          _id,
          title,
          path,
          isHome,
          language
        }
      }
  }
`;
