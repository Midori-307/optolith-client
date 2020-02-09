import * as React from "react"
import { lower } from "../../../../Data/List"
import { fromMaybe, Maybe } from "../../../../Data/Maybe"
import { Record, RecordIBase } from "../../../../Data/Record"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  encumbrance: (r: Record<A>) => string
  encumbranceDescription: (r: Record<A>) => Maybe<string>
}

export interface WikiEncumbranceProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiEncumbranceProps<A>) => ReturnType<React.FC>

export const WikiEncumbrance: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  let string = fromMaybe (lower (translate (l10n) ("inlinewiki.encumbrance.maybe")))
                         (acc.encumbranceDescription (x))

  const encumbrance = acc.encumbrance (x)

  if (encumbrance === "true") {
    string = lower (translate (l10n) ("inlinewiki.encumbrance.yes"))
  }
  else if (encumbrance === "false") {
    string = lower (translate (l10n) ("inlinewiki.encumbrance.no"))
  }

  return (
    <WikiProperty l10n={l10n} title="inlinewiki.encumbrance">
      {string}
    </WikiProperty>
  )
}
