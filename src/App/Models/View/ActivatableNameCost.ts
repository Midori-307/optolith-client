import { List } from "../../../Data/List";
import { fromDefault, makeLenses, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";
import { ActivatableCombinedName } from "./ActivatableCombinedName";

export interface ActivatableNameCost {
  naming: Record<ActivatableCombinedName>
  active: Record<ActiveObjectWithId>
  finalCost: number | List<number>
}

export interface ActivatableNameCostSafeCost extends ActivatableNameCost {
  finalCost: number
}

interface ActivatableNameCostConstructor extends RecordCreator<ActivatableNameCost> {
  (x: PartialMaybeOrNothing<ActivatableNameCostSafeCost>): Record<ActivatableNameCostSafeCost>
}

export const ActivatableNameCost =
  fromDefault<ActivatableNameCost> ({
    naming: ActivatableCombinedName.default,
    active: ActiveObjectWithId.default,
    finalCost: 0,
  }) as ActivatableNameCostConstructor

export const ActivatableNameCostA_ = {
  id: pipe (ActivatableNameCost.A.active, ActiveObjectWithId.A.id),
  name: pipe (ActivatableNameCost.A.naming, ActivatableCombinedName.A.name),
}

export const ActivatableNameCostL = makeLenses (ActivatableNameCost)
