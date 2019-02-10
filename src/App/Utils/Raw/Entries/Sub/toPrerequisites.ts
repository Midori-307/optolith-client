import { pipe } from "ramda";
import { bindF, mapM } from "../../../../../Control/Monad";
import { Either, Left, maybeToEither, Right, second } from "../../../../../Data/Either";
import { flip } from "../../../../../Data/Function";
import { fmap } from "../../../../../Data/Functor";
import { fromArray, isInfixOf, List, Nil, splitOn, uncons } from "../../../../../Data/List";
import { ensure, fromJust, fromMaybe, isNothing, Just, Maybe, Nothing } from "../../../../../Data/Maybe";
import { fromList } from "../../../../../Data/OrderedMap";
import { fromBoth, fst, Pair, snd } from "../../../../../Data/Pair";
import { RequireActivatable } from "../../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../../Models/Wiki/prerequisites/CultureRequirement";
import { RequireIncreasable } from "../../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { PactRequirement } from "../../../../Models/Wiki/prerequisites/PactRequirement";
import { RequirePrimaryAttribute } from "../../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../../../Models/Wiki/prerequisites/SexRequirement";
import { AllRequirementObjects, AllRequirements, LevelAwarePrerequisites } from "../../../../Models/Wiki/wikiTypeHelpers";
import { ifElse } from "../../../ifElse";
import { gte } from "../../../mathUtils";
import { toInt } from "../../../NumberUtils";
import { lookupKeyValid, mstrToMaybe } from "../../validateValueUtils";
import { isRawRequiringActivatable } from "../Prerequisites/RawActivatableRequirement";
import { isRawCultureRequirement } from "../Prerequisites/RawCultureRequirement";
import { isRawRequiringIncreasable } from "../Prerequisites/RawIncreasableRequirement";
import { isRawPactRequirement } from "../Prerequisites/RawPactRequirement";
import { isRawRequiringPrimaryAttribute } from "../Prerequisites/RawPrimaryAttributeRequirement";
import { isRawRaceRequirement } from "../Prerequisites/RawRaceRequirement";
import { isRawSexRequirement } from "../Prerequisites/RawSexRequirement";

const toLevelAwarePrerequisites =
  pipe (
    splitOn ("&&"),
    mapM ("Either")
         (pipe (
           splitOn ("&"),
           uncons,
           fmap (
             p => {
               const level = bindF<number, number> (ensure (gte (0)))
                                                   (toInt (fst (p)))

               if (isNothing (level)) {
                 return Left (`Invalid level. Expected: Natural, Received: ${fst (p)}`)
               }

               const levelAwarePrerequisites =
                 mapM
                   ("Maybe")
                   <string, AllRequirements>
                   (pipe (
                     (x: string) => JSON.parse (x),
                     ensure (x => typeof x === "object" && x !== null || x === "RCP"),
                     bindF<any, AllRequirements> (
                       x => x === "RCP"
                         ? Just<"RCP"> ("RCP")
                         : isRawRequiringActivatable (x)
                         ? Just (RequireActivatable ({
                             id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                             active: x .active,
                             sid: Array.isArray (x .sid)
                               ? Just (fromArray (x .sid))
                               : Maybe (x .sid),
                             sid2: Maybe (x .sid2),
                             tier: Maybe (x .tier),
                           }))
                         : isRawRequiringIncreasable (x)
                         ? Just (RequireIncreasable ({
                             id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                             value: x .value,
                           }))
                         : isRawRequiringPrimaryAttribute (x)
                         ? Just (RequirePrimaryAttribute ({
                             id: Nothing,
                             value: x .value,
                             type: x .type,
                           }))
                         : isRawSexRequirement (x)
                         ? Just (SexRequirement ({
                             id: Nothing,
                             value: x .value,
                           }))
                         : isRawRaceRequirement (x)
                         ? Just (RaceRequirement ({
                             id: Nothing,
                             value: Array.isArray (x .value)
                               ? fromArray (x .value)
                               : x .value,
                           }))
                         : isRawCultureRequirement (x)
                         ? Just (CultureRequirement ({
                             id: Nothing,
                             value: Array.isArray (x .value)
                               ? fromArray (x .value)
                               : x .value,
                           }))
                         : isRawPactRequirement (x)
                         ? Just (PactRequirement ({
                             id: Nothing,
                             category: x .category,
                             domain: Array.isArray (x .domain)
                               ? Just (fromArray (x .domain))
                               : Maybe (x .domain),
                             level: Maybe (x .level),
                           }))
                         : Nothing
                     )
                   ))
                   (snd (p))

               return maybeToEither
                 (
                   `Invalid level-aware prerequisites. `
                   + `Expected: List Prerequisite, Received: ${snd (p)}`
                 )
                 (fmap (fromBoth<number, List<AllRequirements>> (fromJust (level)))
                       (levelAwarePrerequisites))
             }
           ),
           fromMaybe<Either<string, Pair<number, List<AllRequirements>>>>
             (Left ("Invalid list definition for level."))
         )),
    second (fromList)
  )

const toFlatPrerequisites =
  (xs: string) =>
    pipe (
           splitOn ("&"),
           mapM
             ("Maybe")
             <string, AllRequirements>
             (pipe (
               (x: string) => JSON.parse (x),
               ensure (x => typeof x === "object" && x !== null || x === "RCP"),
               bindF<any, AllRequirements> (
                 x => x === "RCP"
                   ? Just<"RCP"> ("RCP")
                   : isRawRequiringActivatable (x)
                   ? Just (RequireActivatable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       active: x .active,
                       sid: Array.isArray (x .sid)
                         ? Just (fromArray (x .sid))
                         : Maybe (x .sid),
                       sid2: Maybe (x .sid2),
                       tier: Maybe (x .tier),
                     }))
                   : isRawRequiringIncreasable (x)
                   ? Just (RequireIncreasable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       value: x .value,
                     }))
                   : isRawRequiringPrimaryAttribute (x)
                   ? Just (RequirePrimaryAttribute ({
                       id: Nothing,
                       value: x .value,
                       type: x .type,
                     }))
                   : isRawSexRequirement (x)
                   ? Just (SexRequirement ({
                       id: Nothing,
                       value: x .value,
                     }))
                   : isRawRaceRequirement (x)
                   ? Just (RaceRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawCultureRequirement (x)
                   ? Just (CultureRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawPactRequirement (x)
                   ? Just (PactRequirement ({
                       id: Nothing,
                       category: x .category,
                       domain: Array.isArray (x .domain)
                         ? Just (fromArray (x .domain))
                         : Maybe (x .domain),
                       level: Maybe (x .level),
                     }))
                   : Nothing
               )
             )),
           maybeToEither
             (
               `Invalid level-aware prerequisites. `
               + `Expected: List Prerequisite, Received: ${xs}`
             )
         )
         (xs)

const toFlatSpellPrerequisites =
  (xs: string) =>
    pipe (
           splitOn ("&"),
           mapM
             ("Maybe")
             <string, AllRequirementObjects>
             (pipe (
               (x: string) => JSON.parse (x),
               ensure (x => typeof x === "object" && x !== null),
               bindF<any, AllRequirementObjects> (
                 x => isRawRequiringActivatable (x)
                   ? Just (RequireActivatable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       active: x .active,
                       sid: Array.isArray (x .sid)
                         ? Just (fromArray (x .sid))
                         : Maybe (x .sid),
                       sid2: Maybe (x .sid2),
                       tier: Maybe (x .tier),
                     }))
                   : isRawRequiringIncreasable (x)
                   ? Just (RequireIncreasable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       value: x .value,
                     }))
                   : isRawRequiringPrimaryAttribute (x)
                   ? Just (RequirePrimaryAttribute ({
                       id: Nothing,
                       value: x .value,
                       type: x .type,
                     }))
                   : isRawSexRequirement (x)
                   ? Just (SexRequirement ({
                       id: Nothing,
                       value: x .value,
                     }))
                   : isRawRaceRequirement (x)
                   ? Just (RaceRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawCultureRequirement (x)
                   ? Just (CultureRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawPactRequirement (x)
                   ? Just (PactRequirement ({
                       id: Nothing,
                       category: x .category,
                       domain: Array.isArray (x .domain)
                         ? Just (fromArray (x .domain))
                         : Maybe (x .domain),
                       level: Maybe (x .level),
                     }))
                   : Nothing
               )
             )),
           maybeToEither
             (
               `Invalid prerequisites. Expected: List Prerequisite, Received: ${xs}`
             )
         )
         (xs)

const toLevelAwareOrPlainPrerequisites =
  ifElse<string, Either<string, LevelAwarePrerequisites>>
    (isInfixOf ("&&"))
    (toLevelAwarePrerequisites)
    (toFlatPrerequisites)

/**
 * Convert a raw string to `Right LevelAwarePrerequisites`. If an error occurs
 * during conversion (scheme incorrect), a `Left` containing the error message
 * will be returned.
 */
export const toPrerequisites =
  flip (
         lookupKeyValid (pipe (
                          mstrToMaybe,
                          fmap (toLevelAwareOrPlainPrerequisites),
                          fromMaybe<Either<string, LevelAwarePrerequisites>> (Right (Nil))
                        ))
       )
       ("prerequisites") as
         (lookup_univ: (key: string) => Maybe<string>) =>
           Either<string, LevelAwarePrerequisites>

/**
 * Convert a raw string to `Right Prerequisites`. If an error occurs during
 * conversion (scheme incorrect), a `Left` containing the error message will be
 * returned.
 */
export const toSpellPrerequisites =
  flip (
         lookupKeyValid (pipe (
                          mstrToMaybe,
                          fmap (toFlatSpellPrerequisites),
                          fromMaybe<Either<string, List<AllRequirementObjects>>>
                            (Right (Nil))
                        ))
       )
       ("prerequisites") as
         (lookup_univ: (key: string) => Maybe<string>) =>
           Either<string, List<AllRequirementObjects>>
