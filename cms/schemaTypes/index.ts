import {dishType} from './documents/dish'
import {imageType} from './documents/image'
import {menuCategoryType} from './documents/menuCategory'
import {metadataType} from './documents/metadata'
import {navigationType} from './documents/navigation'
import {openingHoursType} from './documents/openingHours'
import {pageType} from './documents/page'
import {siteSettingsType} from './documents/siteSettings'
import {imageRefType} from './objects/imageRef'
import {localeStringType} from './objects/localeString'
import {localeTextType} from './objects/localeText'
import {linkAnnotation} from './objects/navigation/link'
import {navItemType} from './objects/navigation/navItem'
import {navTargetType} from './objects/navigation/navTarget'
import {
  contactSectionType,
  menuSectionType,
  openingHoursSectionType,
} from './objects/sections/contentSections'
import {sectionContentType} from './objects/sections/sectionContent'
import {calloutSectionType, textSectionType} from './objects/sections/sectionTypes'
import {timeSlotType} from './objects/timeSlot'

export const schemaTypes = [
  linkAnnotation,
  pageType,
  sectionContentType,
  textSectionType,
  calloutSectionType,
  menuSectionType,
  openingHoursSectionType,
  contactSectionType,
  navigationType,
  navItemType,
  navTargetType,
  metadataType,
  localeStringType,
  localeTextType,
  timeSlotType,
  imageType,
  imageRefType,
  dishType,
  menuCategoryType,
  openingHoursType,
  siteSettingsType,
]
