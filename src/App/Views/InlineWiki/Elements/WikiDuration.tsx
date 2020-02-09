import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { MagicalGroup } from "../../../Constants/Groups"
import { L10nKey, L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  duration: (r: Record<A>) => string
  durationNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Category
  gr: (r: Record<A>) => number
}

export interface WikiDurationProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiDurationProps<A>) => ReturnType<React.FC>

export const WikiDuration: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const gr = acc.gr (x)
  const isNoModAllowed = acc.durationNoMod (x)

  const key: L10nKey =
    category === Category.SPELLS
    && (gr === MagicalGroup.ElvenMagicalSongs || gr === MagicalGroup.MagicalMelodies)
    ? "inlinewiki.skill"
    : "inlinewiki.duration"

  const modKey: L10nKey =
    category === Category.LITURGICAL_CHANTS
    ? "inlinewiki.youcannotuseamodificationonthischantsduration"
    : "inlinewiki.youcannotuseamodificationonthisspellsduration"

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.duration (x)}
{isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}
