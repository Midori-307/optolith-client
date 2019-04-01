import { flip, ident } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { consF, elem, elemF, filter, foldr, intercalate, List, map } from "../../Data/List";
import { fromMaybe, Just, liftM2, liftM3, mapMaybe, Nothing } from "../../Data/Maybe";
import { insert, lookup, OrderedMap } from "../../Data/OrderedMap";
import { uncurryN } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { ActivatableCategory, Categories } from "../Constants/Categories";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId";
import { EntryRating } from "../Models/Hero/heroTypeHelpers";
import { ActivatableActivationValidation } from "../Models/View/ActivatableActivationValidationObject";
import { ActivatableCombinedName } from "../Models/View/ActivatableCombinedName";
import { ActivatableNameCost } from "../Models/View/ActivatableNameCost";
import { ActiveActivatable, ActiveActivatableA_ } from "../Models/View/ActiveActivatable";
import { Culture } from "../Models/Wiki/Culture";
import { L10n } from "../Models/Wiki/L10n";
import { Profession } from "../Models/Wiki/Profession";
import { Race } from "../Models/Wiki/Race";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { getAllActiveByCategory } from "../Utilities/Activatable/activatableActiveUtils";
import { getModifierByActiveLevel, getModifierByIsActive } from "../Utilities/Activatable/activatableModifierUtils";
import { getBracketedNameFromFullName } from "../Utilities/Activatable/activatableNameUtils";
import { getActiveSelections, getSelectOptionName } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { compareLocale } from "../Utilities/I18n";
import { prefixId } from "../Utilities/IDUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils";
import { comparingR } from "../Utilities/sortBy";
import { getBlessedTraditionFromWikiState } from "./liturgicalChantsSelectors";
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from "./rcpSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
import { getMagicalTraditionsFromWiki } from "./spellsSelectors";
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getLocaleAsProp, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from "./stateSelectors";

export const getActive = <T extends ActivatableCategory>(category: T, addLevelToName: boolean) =>
  createMaybeSelector (
    getLocaleAsProp,
    getWiki,
    getCurrentHeroPresent,
    (l10n, wiki, mhero) => fmapF (mhero) (getAllActiveByCategory (category)
                                                                 (addLevelToName)
                                                                 (l10n)
                                                                 (wiki))
  )

export const getActiveForView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, false)

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, true)

type RatingMap = OrderedMap<string, EntryRating>

const insertRating = flip (insert as insert<string, EntryRating>)

export const getAdvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedAdvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getDisadvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedDisadvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getAdvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.ADVANTAGES),
  ident
)

export const getAdvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.ADVANTAGES),
  ident
)

export const getFilteredActiveAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getLocaleAsProp,
  (madvantages, filterText, l10n) =>
    fmapF (madvantages)
          (filterAndSortRecordsBy (0)
                                  ([ActiveActivatableA_.name])
                                  ([comparingR (ActiveActivatableA_.name)
                                               (compareLocale (L10n.A.id (l10n)))])
                                  (filterText))
)

export const getDisadvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.DISADVANTAGES),
  ident
)

export const getDisadvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.DISADVANTAGES),
  ident
)

export const getFilteredActiveDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getLocaleAsProp,
  (mdisadvantages, filterText, l10n) =>
    fmapF (mdisadvantages)
          (filterAndSortRecordsBy (0)
                                  ([ActiveActivatableA_.name])
                                  ([comparingR (ActiveActivatableA_.name)
                                               (compareLocale (L10n.A.id (l10n)))])
                                  (filterText))
)

export const getSpecialAbilitiesForSheet = createMaybeSelector (
  getActiveForView (Categories.SPECIAL_ABILITIES),
  ident
)

export const getSpecialAbilitiesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.SPECIAL_ABILITIES),
  ident
)

export const getFilteredActiveSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  getLocaleAsProp,
  (mspecial_abilities, sortOptions, filterText) =>
    fmapF (mspecial_abilities)
          (filterAndSortRecordsBy (0)
                                  ([ActiveActivatableA_.name])
                                  (sortOptions)
                                  (filterText))
)

export const getGeneralSpecialAbilitiesForSheet = createMaybeSelector (
  getWikiSpecialAbilities,
  getSpecialAbilitiesForSheet,
  getCultureAreaKnowledge,
  (wiki_special_abilities, mspecial_abilities, culture_area_knowledge_text) =>
    liftM2 ((culture_area_knowledge: Record<SpecialAbility>) =>
             pipe (
                    filter (pipe (
                             ActiveActivatable.A.wikiEntry,
                             SpecialAbility.AL.gr,
                             elemF (List (1, 2, 22, 30))
                           )),
                    consF (ActiveActivatable ({
                            nameAndCost: ActivatableNameCost ({
                              active: ActiveObjectWithId ({
                                id: SpecialAbility.A.id (culture_area_knowledge),
                                sid: Nothing,
                                sid2: Nothing,
                                tier: Nothing,
                                cost: Nothing,
                                index: Nothing,
                              }),
                              finalCost: 0,
                              naming: ActivatableCombinedName ({
                                name:
                                  `${SpecialAbility.A.name (culture_area_knowledge)}`
                                  + ` (${fromMaybe ("") (culture_area_knowledge_text)})`,
                                baseName: SpecialAbility.A.name (culture_area_knowledge),
                                addName: culture_area_knowledge_text,
                              }),
                            }),
                            validation: ActivatableActivationValidation ({
                              disabled: true,
                              maxLevel: Nothing,
                              minLevel: Nothing,
                            }),
                            heroEntry: ActivatableDependent.default,
                            wikiEntry: SpecialAbility.default,
                          }))))
           (lookup (prefixId (IdPrefixes.SPECIAL_ABILITIES) (22))
                   (wiki_special_abilities))
           (mspecial_abilities)
)

const getSpecialAbilitiesByGroups =
  (grs: List<number>) =>
    fmap (filter (pipe (
      ActiveActivatable.A.wikiEntry,
      SpecialAbility.AL.gr,
      elemF (grs)
    )))

export const getCombatSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (List (4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 28))
)

export const getMagicalSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (List (3, 9, 10, 11, 12, 21))
)

export const getBlessedSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (List (7, 8, 23, 24, 25, 26, 27, 29))
)

export const getFatePointsModifier = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) ("ADV_14"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_31"),
  uncurryN (getModifierByIsActive (Nothing))
)

export const getMagicalTraditionForSheet = createMaybeSelector (
  getMagicalTraditionsFromWiki,
  fmap (pipe (
    map (pipe (SpecialAbility.A.name, getBracketedNameFromFullName)),
    intercalate (", ")
  ))
)

export const getBlessedTraditionForSheet = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  fmap (pipe (SpecialAbility.A.name, getBracketedNameFromFullName))
)

const getPropertyOrAspectKnowledgesForSheet =
  uncurryN (
    liftM2 ((hero_entry: Record<ActivatableDependent>) => (wiki_entry: Record<SpecialAbility>) =>
             mapMaybe ((x: string | number) =>
                         pipe_ (x, Just, getSelectOptionName (wiki_entry)))
                       (getActiveSelections (hero_entry))))

export const getPropertyKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities) ("SA_72"),
  mapGetToSlice (getWikiSpecialAbilities) ("SA_72"),
  getPropertyOrAspectKnowledgesForSheet
)

export const getAspectKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities) ("SA_87"),
  mapGetToSlice (getWikiSpecialAbilities) ("SA_87"),
  getPropertyOrAspectKnowledgesForSheet
)

export const getInitialStartingWealth = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) ("ADV_36"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_2"),
  (rich, poor) => getModifierByActiveLevel (Just (0)) (rich) (poor) * 250 + 750
)

export const isAlbino = createMaybeSelector (
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_45"),
  fmap (pipe (
    getActiveSelections,
    elem<string | number> (1)
  ))
)
