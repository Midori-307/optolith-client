import { last } from 'lodash';
import { Pact } from '../actions/PactActions';
import { Categories } from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { WikiState } from '../reducers/wikiReducer';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { get, getAllByCategory, getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { getBlessedTraditionResultFunc } from '../selectors/liturgicalChantsSelectors';
import { getMagicalTraditionsResultFunc } from '../selectors/spellsSelectors';
import * as Data from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable.d';
import { Activatable, Application, SelectionObject, Skillish } from '../types/wiki.d';
import { isStyleValidToRemove } from './ExtendedStyleUtils';
import { sortObjects, sortStrings } from './FilterSortUtils';
import { _translate } from './I18n';
import { getCategoryById } from './IDUtils';
import { getTraditionOfAspect, isOwnTradition } from './LiturgyUtils';
import { getRoman } from './NumberUtils';
import { getFlatFirstTierPrerequisites, getFlatPrerequisites, getMinTier, isRequiringActivatable, validate, validateObject, validateTier } from './RequirementUtils';
import { getWikiEntry } from './WikiUtils';
import { getHeroStateListItem } from './heroStateUtils';

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export function isActive(obj: Data.ActivatableDependent | undefined): boolean {
  return typeof obj === 'object' && obj.active.length > 0;
}

/**
 * Checks if you can somehow add an ActiveObject to the given entry.
 * @param state The present state of the current hero.
 * @param instance The entry.
 */
export function isActivatable(
  state: Data.HeroDependent,
  wiki: WikiState,
  pact: Pact | undefined,
  instance: Data.ActivatableDependent,
): boolean {
  const wikiEntry = getWikiEntry<Activatable>(wiki, instance.id);

  if (wikiEntry && wikiEntry.category === Categories.SPECIAL_ABILITIES && [9, 10].includes(wikiEntry.gr)) {
    const combinationSA = getHeroStateListItem<Data.ActivatableDependent>(state, 'SA_164');
    if (!combinationSA) {
      const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
      const totalActive = allStyles.filter(e => isActive(e)).length;
      if (totalActive >= 1) {
        return false;
      }
    }
    else {
      const combinationAvailable = isActive(combinationSA);
      if (combinationAvailable) {
        const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
        const allEqualTypeStyles = allStyles.filter(e => e.gr === instance.gr);
        const totalActive = allStyles.filter(e => isActive(e)).length;
        const equalTypeStyleActive = allEqualTypeStyles.filter(e => isActive(e)).length;
        if (totalActive >= 3 || equalTypeStyleActive >= 2) {
          return false;
        }
      }
      else {
        const allEqualTypeStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, instance.gr);
        if (allEqualTypeStyles.find(e => isActive(e))) {
          return false;
        }
      }
    }
  }
  else if (instance.category === Categories.SPECIAL_ABILITIES && instance.gr === 13) {
    const combinationSA = dependent.specialAbilities.get('SA_266');
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 13);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    if (totalActive >= (isActive(combinationSA) ? 2 : 1)) {
      return false;
    }
  }
  else if (instance.category === Categories.SPECIAL_ABILITIES && instance.gr === 25) {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 25);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    if (totalActive >= 1) {
      return false;
    }
  }
  else if (instance.id === 'SA_164') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
    const isOneActive = allStyles.find(e => isActive(e));
    if (!isOneActive) {
      return false;
    }
  }
  else if (instance.id === 'SA_266') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 13);
    const isOneActive = allStyles.find(e => isActive(e));
    if (!isOneActive) {
      return false;
    }
  }
  else if (instance.id === 'SA_667') {
    const allPactPresents = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 30);
    if (allPactPresents.some(e => isActive(e))) {
      return false;
    }
  }
  else if (instance.category === Categories.SPECIAL_ABILITIES && instance.gr === 30) {
    const darkPactSA = dependent.specialAbilities.get('SA_667');
    const allPactPresents = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 30);
    const countPactPresents = allPactPresents.reduce((n, obj) => {
      if (isActive(obj)) {
        if (!Array.isArray(obj.reqs) && Array.isArray(obj.cost) && typeof obj.tiers === 'number') {
          return n + obj.active[0].tier!;
        }
        return n + 1;
      }
      return n;
    }, 0);
    if (isActive(darkPactSA) || pact === undefined || pact.level <= countPactPresents) {
      return false;
    }
  }
  else if (instance.id === 'SA_699') {
    if (state.rules.enableLanguageSpecializations === false) {
      return false;
    }
  }
  return validate(state, getFlatFirstTierPrerequisites(instance.reqs), instance.id, pact);
}

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 * @param sid The sid of the ActiveObject
 */
export function isDeactivatable(state: CurrentHeroInstanceState, obj: ActivatableInstance, sid: string | number | undefined, pact: Pact | undefined): boolean {
  const { dependent } = state;
  if (obj.id === 'SA_164') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
    const allArmedStyles = allStyles.filter(e => e.gr === 9);
    const allUnarmedStyles = allStyles.filter(e => e.gr === 10);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    const armedStyleActive = allArmedStyles.filter(e => isActive(e)).length;
    const unarmedStyleActive = allUnarmedStyles.filter(e => isActive(e)).length;
    if (totalActive >= 3 || armedStyleActive >= 2 || unarmedStyleActive >= 2) {
      return false;
    }
  }
  else if (obj.id === 'SA_266') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 13);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    if (totalActive >= 2) {
      return false;
    }
  }
  else if (obj.id === 'SA_623' || obj.id === 'SA_625' || obj.id === 'SA_632') {
    const liturgicalChants = [...dependent.liturgies.values()];
    const activeLiturgicalChants = liturgicalChants.filter(e => e.active);
    const blessedTradition = getBlessedTraditionResultFunc(dependent.specialAbilities);
    const hasUnfamiliarEntry = !!blessedTradition && activeLiturgicalChants.some(e => {
      return !isOwnTradition(blessedTradition!, e);
    });
    if (hasUnfamiliarEntry) {
      return false;
    }
  }
  if (obj.category === Categories.SPECIAL_ABILITIES) {
    const validStyle = isStyleValidToRemove(dependent, obj);
    if (validStyle === false) {
      return false;
    }
  }
  const dependencies = obj.dependencies.filter(e => {
    if (typeof e === 'object' && e.origin) {
      const origin = get(dependent, e.origin) as SpecialAbilityInstance;
      const req = getFlatPrerequisites(origin.reqs).find(r => typeof r !== 'string' && Array.isArray(r.id) && !!e.origin && r.id.includes(e.origin)) as AllRequirementObjects | undefined;
      if (req) {
        const resultOfAll = (req.id as string[]).map(e => validateObject(state, { ...req, id: e } as AllRequirementObjects, obj.id, pact));
        return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? true : false;
      }
      return true;
    }
    else if (typeof e === 'object' && Array.isArray(e.sid)) {
      const list = e.sid;
      if (list.includes(sid as number)) {
        return !getSids(obj).some(n => n !== sid && list.includes(n as number));
      }
    }
    return true;
  });
  return dependencies.length === 0;
}

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export function getSids(obj: ActivatableInstance): Array<string | number> {
  return obj.active.map(e => e.sid as string | number);
}

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export function getDSids(obj: ActivatableInstance): Array<(string | number)[] | string | number | boolean | undefined> {
  return obj.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
}

/**
 * Get a selection option with the given id from given entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionItem(obj: ActivatableInstance, id?: string | number): SelectionObject | undefined {
  if (obj.sel) {
    return obj.sel.find(e => e.id === id);
  }
  return undefined;
}

/**
 * Get a selection option's name with the given id from given entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionName(obj: ActivatableInstance, id?: string | number): string | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem) {
    return selectionItem.name;
  }
  return undefined;
}

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectOptionName(obj: Activatable, id?: string | number): string | undefined {
  const selectionItem = findSelectOption(obj, id);
  if (selectionItem) {
    return selectionItem.name;
  }
  return undefined;
}

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectOptionCost(obj: Activatable, id?: string | number): number | undefined {
  const selectionItem = findSelectOption(obj, id);
  if (selectionItem) {
    return selectionItem.cost;
  }
  return undefined;
}

/**
 * Get a selection option's `name` and `cost` with the given id from given
 * entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionNameAndCost(obj: ActivatableInstance, id?: string | number): { name: string; cost: number; } | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem && selectionItem.cost) {
    const { name, cost } = selectionItem;
    return { name, cost };
  }
  return undefined;
}

export function getFullName(obj: string | ActiveViewObject): string {
  if (typeof obj === 'string') {
    return obj;
  }
  const { tierName } = obj;
  let { name } = obj;
  if (tierName) {
    name += tierName;
  }
  return name;
}

export function isMagicalOrBlessed(obj: ActivatableInstance) {
  const isBlessed = getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_12' && isRequiringActivatable(e) && !!e.active);
  const isMagical = getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_50' && isRequiringActivatable(e) && !!e.active);
  return {
    isBlessed,
    isMagical
  };
}

export function getSecondSidMap(entry: ActivatableInstance): Map<string, (string | number)[]> {
  const map = new Map<string, (number | string)[]>();

  for (const obj of entry.active) {
    const { sid, sid2 } = obj as { sid: string; sid2: string | number };
    const current = map.get(sid);
    if (current) {
      map.set(sid, [...current, sid2]);
    }
    else {
      map.set(sid, [sid2]);
    }
  }

  return map;
}

/**
 * Generates a list of ActiveObjects based on the given instance.
 */
export function convertActivatableToArray({ active, id }: ActivatableInstance): ActiveObjectWithId[] {
  return active.map((e, index) => ({ ...e, id, index }));
}

/**
 * Get all active items in an array.
 * @param state A state slice.
 */
export function getActiveFromState(state: Map<string, ActivatableInstance>): ActiveObjectWithId[] {
  return [...state.values()].reduce<ActiveObjectWithId[]>((arr, e) => [...arr, ...convertActivatableToArray(e)], []);
}

interface ActiveObjectAny extends ActiveObject {
	[key: string]: any;
}

export function getActiveObjectCore({ sid, sid2, tier }: ActiveObjectAny): ActiveObject {
  return { sid, sid2, tier };
}

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export function getValidation(obj: ActiveObjectWithId, state: CurrentHeroInstanceState, pact: Pact | undefined) {
  const { dependent, el } = state;
  const { id, sid } = obj;
  const instance = get(dependent, id) as ActivatableInstance;
  const { dependencies, active, reqs } = instance;
  let { tiers } = instance;

  let disabled = !isDeactivatable(state, instance, sid, pact);
  let maxTier: number | undefined;
  let minTier = getMinTier(dependencies, sid);

  if (!Array.isArray(reqs)) {
    maxTier = validateTier(state, reqs, dependencies, id, pact);
  }

  switch (id) {
    case 'ADV_16': {
      const { value } = (get(dependent, sid as string)) as SkillInstance;
      const counter = instance.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
      disabled = disabled || getStart(el).maxSkillRating + counter === value;
      break;
    }
    case 'ADV_17': {
      const { value } = (get(dependent, sid as string)) as CombatTechniqueInstance;
      disabled = disabled || getStart(el).maxCombatTechniqueRating + 1 === value;
      break;
    }
    case 'ADV_58': {
      const activeSpells = getAllByCategory(dependent, Categories.SPELLS).reduce((n, e) => e.active ? n + 1 : n, 0);
      if (activeSpells > 3) {
        minTier = activeSpells - 3;
      }
      break;
    }
    case 'ADV_79': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive).length;
      if (active > 3) {
        minTier = active - 3;
      }
      break;
    }
    case 'ADV_80': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive).length;
      if (active > 3) {
        minTier = active - 3;
      }
      break;
    }
    case 'ADV_58': {
      const activeSpells = [...dependent.spells.values()].reduce((n, e) => e.active ? n + 1 : n, 0);
      if (activeSpells > 3) {
        minTier = activeSpells - 3;
      }
      break;
    }
    case 'DISADV_72': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive).length;
      if (active < 3) {
        minTier = 3 - active;
      }
      break;
    }
    case 'DISADV_73': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive).length;
      if (active < 3) {
        minTier = 3 - active;
      }
      break;
    }
    case 'SA_29':
      tiers = 3;
      break;
    case 'SA_70':
    case 'SA_255':
    case 'SA_345':
    case 'SA_346':
    case 'SA_676':
    case 'SA_677':
    case 'SA_678':
    case 'SA_679':
    case 'SA_680':
    case 'SA_681': {
      const multipleTraditions = getMagicalTraditionsResultFunc(dependent.specialAbilities).length > 1;
      if (!multipleTraditions && ([...dependent.spells.values()].some(e => e.active) || [...dependent.cantrips.values()].some(e => e.active))) {
        disabled = true;
      }
      break;
    }
    case 'SA_86':
    case 'SA_682':
    case 'SA_683':
    case 'SA_684':
    case 'SA_685':
    case 'SA_686':
    case 'SA_687':
    case 'SA_688':
    case 'SA_689':
    case 'SA_690':
    case 'SA_691':
    case 'SA_692':
    case 'SA_693':
    case 'SA_694':
    case 'SA_695':
    case 'SA_696':
    case 'SA_697':
    case 'SA_698': {
      if ([...dependent.liturgies.values()].some(e => e.active) || [...dependent.blessings.values()].some(e => e.active)) {
        disabled = true;
      }
      break;
    }
    case 'SA_667': {
      maxTier = pact!.level;
      break;
    }
  }

  if (typeof tiers === 'number' && minTier) {
    disabled = true;
  }

  if (!disabled && dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : (Object.keys(e) as ('sid' | 'sid2' | 'tier')[]).every(key => obj[key] === e[key]) && Object.keys(obj).length === Object.keys(e).length)) {
    disabled = true;
  }

  return {
    ...obj,
    disabled,
    maxTier,
    minTier,
    tiers
  };
}

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export function getNameCost(obj: ActiveObjectWithId, wiki: WikiState, dependent: DependentInstancesState, costToAdd: boolean, locale?: UIMessages): ActivatableNameCost {
  const currentCost = getCost(obj, wiki, dependent, costToAdd);
  const names = getName(obj, wiki, locale);

  return {
    ...obj,
    ...names,
    currentCost
  };
}

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param locale The locale-dependent messages.
 */
export function getNameCostForWiki(obj: ActiveObjectWithId, wiki: WikiState, locale?: UIMessages): ActivatableNameCost {
  const currentCost = getCost(obj, wiki);
  const names = getName(obj, wiki, locale);

  return {
    ...obj,
    ...names,
    currentCost
  };
}

/**
 * Returns the AP you get when removing the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param dependent The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 */
export function getCost(obj: ActiveObjectWithId, wiki: WikiState, dependent?: DependentInstancesState, costToAdd?: boolean): number | number[] {
  const { id, sid, tier, cost: customCost } = obj;
  const instance = getWikiEntry(wiki, id) as Activatable;
  const { cost, category, select } = instance;
  const active = dependent && (get(dependent, id) as ActivatableInstance).active;

  let currentCost: number | number[] | undefined;

  if (customCost !== undefined) {
    currentCost = customCost;
  }
  else {
    switch (id) {
      case 'ADV_4':
      case 'ADV_47':
      case 'ADV_16':
      case 'ADV_17':
      case 'DISADV_48':
      case 'SA_231':
      case 'SA_250':
      case 'SA_472':
      case 'SA_473':
      case 'SA_531':
      case 'SA_569': {
        const entry = typeof sid === 'string' ? getWikiEntry<Skillish>(wiki, sid) : undefined;
        if (entry) {
          const { ic } = entry;
          currentCost = (cost as number[])[ic - 1];
        }
        else {
          currentCost = 0;
        }
        break;
      }
      case 'DISADV_34':
      case 'DISADV_50': {
        if (typeof active === 'object') {
          const compareMaxTier = (a: number, tier: number, cost: number | undefined) => {
            return tier > a && cost === undefined ? tier : a;
          };
          const compareSubMaxTier = (a: number, tier: number, cost: number | undefined, maxCurrentTier: number) => {
            return tier > a && tier < maxCurrentTier && cost === undefined ? tier : a;
          };

          const maxCurrentTier = active.reduce((a, { tier, cost }) => compareMaxTier(a, tier!, cost), 0);
          const subMaxCurrentTier = active.reduce((a, { tier, cost }) => compareSubMaxTier(a, tier!, cost, maxCurrentTier), 0);

          if (maxCurrentTier > tier! || active.filter(e => e.tier === tier).length > (costToAdd ? 0 : 1)) {
            currentCost = 0;
          }
          else {
            currentCost = (cost as number) * (tier! - subMaxCurrentTier);
          }
        }
        else {
          currentCost = (cost as number) * tier!;
        }
        break;
      }
      case 'DISADV_33': {
        if (sid === 7 && typeof active === 'object' && active.filter(e => e.sid === 7 && e.cost === undefined).length > (costToAdd ? 0 : 1)) {
          currentCost = 0;
        }
        else {
          currentCost = getSelectOptionCost(instance, sid);
        }
        break;
      }
      case 'DISADV_36':
        currentCost = typeof active === 'object' && active.filter(e => e.cost === undefined).length > (costToAdd ? 2 : 3) ? 0 : cost as number;
        break;
      case 'SA_9': {
        const skill = wiki.skills.get(sid as string)!;
        if (typeof dependent === 'object') {
          const counter = dependent.specialAbilities.get(id)!.active.reduce((c, obj) => obj.sid === sid && obj.cost === undefined ? c + 1 : c, 0);
          currentCost = skill.ic * (counter + (costToAdd ? 1 : 0));
        }
        else {
          currentCost = skill.ic;
        }
        break;
      }
      case 'SA_29':
        currentCost = tier === 4 ? 0 : cost as number;
        break;
      case 'SA_72': {
        const apArr = [10, 20, 40];
        currentCost = active && apArr[active.filter(e => e.cost === undefined).length - (costToAdd ? 0 : 1)];
        break;
      }
      case 'SA_87': {
        const apArr = [15, 25, 45];
        currentCost = active && apArr[active.filter(e => e.cost === undefined).length - (costToAdd ? 0 : 1)];
        break;
      }
      case 'SA_87': {
        currentCost = cost as number;
        if (typeof dependent === 'object' && isActive(dependent.disadvantages.get('DISADV_17'))) {
          currentCost -= 10;
        }
        if (typeof dependent === 'object' && isActive(dependent.disadvantages.get('DISADV_18'))) {
          currentCost -= 10;
        }
        break;
      }
      case 'SA_533': {
        const entry = typeof sid === 'string' ? wiki.skills.get(sid) : undefined;
        const SA_531 = dependent && dependent.specialAbilities.get('SA_531')!.active;
        const firstSID = SA_531 && SA_531[0] && SA_531[0].sid;
        const firstEntry = typeof firstSID === 'string' ? wiki.skills.get(firstSID) : undefined;
        if (entry && firstEntry) {
          const { ic } = entry;
          currentCost = (cost as number[])[ic - 1] + firstEntry.ic;
        }
        else {
          currentCost = 0;
        }
        break;
      }
      case 'SA_699': {
        currentCost = cost as number;
        if (typeof dependent === 'object') {
          const languages = dependent.specialAbilities.get('SA_29');
          const activeLanguages = languages && languages.active;
          const baseLanguage = activeLanguages && activeLanguages.find(e => e.sid === sid);
          if (baseLanguage && baseLanguage.tier === 4) {
            currentCost = 0;
          }
        }
        break;
      }

      default:
        if (Array.isArray(select) && cost === 'sel') {
          currentCost = getSelectOptionCost(instance, sid);
        }
        break;
    }

    if (currentCost === undefined) {
      currentCost = cost as number | number[];
    }
  }

  if (category === Categories.DISADVANTAGES) {
    currentCost = typeof currentCost === 'object' ? currentCost.map(e => -e) : -currentCost;
  }

  return currentCost;
}

export interface CombinedName {
  combinedName: string;
  baseName: string;
  addName: string | undefined;
}

/**
 * Returns name, splitted and combined, of advantage/disadvantage/special ability.
 * @param obj The ActiveObject with origin id.
 * @param wiki The current hero's state.
 * @param locale The locale-dependent messages.
 */
export function getName(obj: ActiveObjectWithId, wiki: WikiState, locale?: UIMessages): CombinedName {
  const { id, sid, sid2, tier } = obj;
  const instance = getWikiEntry(wiki, id) as Activatable;
  const { select, input, name } = instance;

  let combinedName = name;
  let addName: string | undefined;

  switch (id) {
    case 'ADV_4':
    case 'ADV_47':
    case 'ADV_16':
    case 'ADV_17':
    case 'DISADV_48':
    case 'SA_231':
    case 'SA_250':
    case 'SA_472':
    case 'SA_473':
    case 'SA_531':
    case 'SA_569': {
      const entry = typeof sid === 'string' ? getWikiEntry(wiki, sid) as Skillish : undefined;
      if (entry) {
        const { name } = entry;
        addName = name;
      }
      break;
    }
    case 'ADV_68': {
      const selectionItem = findSelectOption(instance, sid);
      addName = selectionItem && `${sid2} (${selectionItem.name})`;
      break;
    }
    case 'DISADV_33': {
      const selection = getSelectOptionName(instance, sid);
      if ([7, 8].includes(sid as number)) {
        addName = `${selection}: ${sid2}`;
      }
      else {
        addName = selection;
      }
      break;
    }
    case 'SA_9': {
      const skill = wiki.skills.get(sid as string)!;
      let name;
      if (typeof sid2 === 'string') {
        name = sid2;
      }
      else {
        const selectedApplication = skill.applications && skill.applications.find(e => e.id === sid2);
        if (typeof selectedApplication === 'object') {
          name = selectedApplication.name;
        }
      }
      addName = `${skill.name}: ${name}`;
      break;
    }
    case 'SA_677':
    case 'SA_678':
      const part = getTraditionNameFromFullName(name);
      const musictraditionLabels = _translate(locale, 'musictraditions');
      if (musictraditionLabels && typeof sid2 === 'number') {
        combinedName = combinedName.replace(part, `${part}: ${musictraditionLabels[sid2 - 1]}`);
      }
      break;
    case 'SA_680':
      const entry = wiki.skills.get(sid as string);
      if (entry) {
        addName += `: ${entry.name}`;
      }
      break;
    case 'SA_533': {
      const entry = typeof sid === 'string' ? wiki.skills.get(sid) : undefined;
      if (entry) {
        const { name } = entry;
        addName = name;
      }
      break;
    }
    case 'SA_414':
    case 'SA_663': {
      const selectionItem = findSelectOption(instance, sid);
      const targetInstance = selectionItem && (id === 'SA_414' ? wiki.spells.get(selectionItem.target!) : wiki.liturgicalChants.get(selectionItem.target!));
      addName = targetInstance && `${targetInstance.name}: ${selectionItem!.name}`;
      break;
    }
    case 'SA_699': {
      const languages = wiki.specialAbilities.get('SA_29')!;
      const selectionItem = findSelectOption(languages, sid);
      addName = selectionItem && `${selectionItem.name}: ${typeof sid2 === 'string' ? sid2 : selectionItem.spec![sid2! - 1]}`;
      break;
    }

    default:
      if (typeof input === 'string' && typeof sid === 'string') {
        addName = sid;
      }
      else if (Array.isArray(select)) {
        addName = getSelectOptionName(instance, sid);
      }
      break;
  }

  switch (id) {
    case 'ADV_28':
    case 'ADV_29':
      combinedName = `${_translate(locale, 'activatable.view.immunityto')} ${addName}`;
      break;
    case 'ADV_68':
      combinedName = `${_translate(locale, 'activatable.view.hatredof')} ${addName}`;
      break;
    case 'DISADV_1':
      combinedName = `${_translate(locale, 'activatable.view.afraidof')} ${addName}`;
      break;
    case 'DISADV_34':
    case 'DISADV_50':
      combinedName  += ` ${getRoman(tier as number)} (${addName})`;
      break;
    case 'SA_639':
      combinedName  += ` ${addName}`;
      break;
    default:
      if (addName) {
        combinedName += ` (${addName})`;
      }
  }

  return {
    combinedName,
    baseName: name,
    addName
  };
}

export function convertPerTierCostToFinalCost(obj: ActivatableNameCost, locale?: UIMessages, addTierToCombinedTier?: boolean): ActivatableNameCostEvalTier {
  const { id, tier, cost } = obj;
  let { currentCost, combinedName } = obj;
  let tierName;
  if (Array.isArray(currentCost)) {
    const { tier = 1 } = obj;
    currentCost = currentCost.reduce((sum, current, index) => index <= (tier - 1) ? sum + current : sum, 0);
    tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
  }
  else if (typeof tier === 'number' && id !== 'DISADV_34' && id !== 'DISADV_50' && typeof cost !== 'number') {
    currentCost *= tier;
    if (id === 'SA_29' && tier === 4) {
      tierName = ` ${_translate(locale, 'mothertongue.short')}`;
    }
    else if (getCategoryById(obj.id) === 'SPECIAL_ABILITIES') {
      tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
    }
    else {
      tierName = ` ${getRoman(tier)}`;
    }
  }
  if (addTierToCombinedTier !== true && tierName) {
    combinedName += tierName;
  }
  return {
    ...obj,
    tierName,
    combinedName,
    currentCost
  };
}

export function getDeactiveView(
  entry: ActivatableInstance,
  state: CurrentHeroInstanceState,
  validExtendedSpecialAbilities: string[],
  locale: UIMessages,
  adventurePoints: AdventurePointsObject,
  pact: Pact | undefined,
): DeactiveViewObject | undefined {
  const { dependent } = state;
  const { id, cost, max, active, name, input, tiers, dependencies, reqs } = entry;
  if (isActivatable(state, entry, pact) && !dependencies.includes(false) && (max === undefined || active.length < max) && (!isExtendedSpecialAbility(entry) || validExtendedSpecialAbilities.includes(id))) {
    let maxTier: number | undefined;
    if (!Array.isArray(reqs)) {
      maxTier = validateTier(state, reqs, dependencies, id, pact);
    }
    switch (id) {
      case 'ADV_4':
      case 'ADV_17':
      case 'ADV_47': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, cost, instance: entry };
      }
      case 'ADV_16': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => activeIds.filter(d => d === e.id).length < 2 && !getDSids(entry).includes(e.id));
        return { id, name, sel, cost, instance: entry };
      }
      case 'ADV_28':
      case 'ADV_29': {
        const sel = entry.sel!.filter(e => !getDSids(entry).includes(e.id));
        return { id, name, sel, instance: entry };
      }
      case 'ADV_32': {
        const sel = entry.sel!.filter(e => !getSids(get(dependent, 'DISADV_24') as DisadvantageInstance).includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'DISADV_59': {
        const activeSpells = [...dependent.spells.values()].reduce((n, e) => e.active ? n + 1 : n, 0);
        if (activeSpells < 3) {
          return { id, name, cost, tiers, maxTier: 3 - activeSpells, instance: entry };
        }
        break;
      }
      case 'DISADV_1':
      case 'DISADV_34':
      case 'DISADV_50': {
        const sel = entry.sel!.filter(e => !getDSids(entry).includes(e.id));
        return { id, name, tiers, sel, input, cost, instance: entry };
      }
      case 'DISADV_24': {
        const sel = entry.sel!.filter(e => !getSids(get(dependent, 'ADV_32') as AdvantageInstance).includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'DISADV_33':
      case 'DISADV_37':
      case 'DISADV_51': {
        let sel;
        const activeIds = getSids(entry);
        if (entry.id === 'DISADV_33') {
          sel = entry.sel!.filter(e => ([7, 8].includes(e.id as number) || !activeIds.includes(e.id)) && !getDSids(entry).includes(e.id));
        }
        else {
          sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        }
        return { id, name, sel, cost, instance: entry };
      }
      case 'DISADV_36': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'DISADV_48': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => {
          if ((get(dependent, 'ADV_40') as AdvantageInstance).active.length > 0 || (get(dependent, 'ADV_46') as AdvantageInstance).active.length > 0) {
            if ((get(dependent, e.id as string) as SkillInstance).ic === 2) {
              return false;
            }
          }
          return !activeIds.includes(e.id) && !getDSids(entry).includes(e.id);
        });
        return { id, name, sel, cost, instance: entry };
      }
      case 'DISADV_59': {
        const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
        if (activeSpells < 3) {
          return { id, name, cost, tiers, maxTier: 3 - activeSpells, instance: entry };
        }
        break;
      }
      case 'SA_17': {
        const sum = (get(dependent, 'TAL_51') as TalentInstance).value + (get(dependent, 'TAL_55') as TalentInstance).value;
        if (sum >= 12) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_18':
        if ((getAllByCategoryGroup(dependent, Categories.COMBAT_TECHNIQUES, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length > 0) {
          return { id, name, cost, instance: entry };
        }
        break;
      case 'SA_3': {
        const activeIds = getSids(entry);
        const sel = (entry.sel as Array<SelectionObject & { req: AllRequirementTypes[] }>).filter(e => !activeIds.includes(e.id) && validate(state, e.req, id, pact) && !getDSids(entry).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_9': {
        const counter = getSecondSidMap(entry);
        type Sel = Array<SelectionObject & { applications?: Application[]; applicationsInput?: string }>;
        const filtered = (entry.sel as Sel).filter(e => {
          const id = e.id as string;
          if (getDSids(entry).includes(id)) {
            return false;
          }
          else if (counter.has(id)) {
            const arr = counter.get(id);
            return arr && arr.length < 3 && (get(dependent, id) as TalentInstance).value >= 6 * (arr.length + 1);
          }
          return (get(dependent, id) as TalentInstance).value >= 6;
        });
        const mapped = filtered.map(e => {
          const id = e.id as string;
          const arr = counter.get(id);
          return {
            ...e,
            cost: arr ? e.cost! * (arr.length + 1) : e.cost,
            applications: e.applications && e.applications.filter(n => {
              const isInactive = !arr || !arr.includes(n.id);
              const arePrerequisitesMet =
                typeof n.prerequisites !== 'object' ||
                validate(state, n.prerequisites, id, pact);

              return isInactive && arePrerequisitesMet;
            })
          };
        });
        const sel = sortObjects(mapped, locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_28': {
        type Sel = Array<SelectionObject & { talent: [string, number]; }>;
        const activeIds = getSids(entry);
        const sel = (entry.sel as Sel).filter(e => {
          if (getDSids(entry).includes(e.id)) {
            return false;
          }
          else {
            return !activeIds.includes(e.id) && (get(dependent, e.talent[0]) as TalentInstance).value >= e.talent[1];
          }
        });
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_29': {
        const sel = sortObjects(entry.sel!.filter(e => active.every(n => n.sid !== e.id) && !getDSids(entry).includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, tiers: 3, instance: entry };
        }
        break;
      }
      case 'SA_70':
      case 'SA_255':
      case 'SA_345':
      case 'SA_346':
      case 'SA_676':
      case 'SA_681': {
        const magicalTraditions = getMagicalTraditionsResultFunc(dependent.specialAbilities);
        if (magicalTraditions.length === 0) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_86':
      case 'SA_682':
      case 'SA_683':
      case 'SA_684':
      case 'SA_685':
      case 'SA_686':
      case 'SA_687':
      case 'SA_688':
      case 'SA_689':
      case 'SA_690':
      case 'SA_691':
      case 'SA_692':
      case 'SA_693':
      case 'SA_694':
      case 'SA_695':
      case 'SA_696':
      case 'SA_697':
      case 'SA_698': {
        const blessedTradition = getBlessedTraditionResultFunc(dependent.specialAbilities);
        if (!blessedTradition) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_72': {
        const spellsAbove10 = [...dependent.spells.values()].filter(e => e.value >= 10);
        const counter = spellsAbove10.reduce((map, obj) => {
          const property = obj.property;
          if (map.has(property)) {
            map.set(property, map.get(property)! + 1);
          }
          else {
            map.set(property, 1);
          }
          return map;
        }, new Map<number, number>());
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => {
          const spellsAbove10WithProperty = counter.get(e.id as number);
          return spellsAbove10WithProperty && spellsAbove10WithProperty >= 3 && !activeIds.includes(e.id) && !getDSids(entry).includes(e.id);
        }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        if (sel.length > 0) {
          const apArr = [10, 20, 40];
          const cost = apArr[active.length];
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_81': {
        const activeIds = getSids(entry);
        const sel = sortObjects(entry.sel!.filter(e => getSids(get(dependent, 'SA_72') as SpecialAbilityInstance).includes(e.id) && !activeIds.includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_87': {
        const liturgiesAbove10 = [...dependent.liturgies.values()].filter(e => e.value >= 10);
        const counter = liturgiesAbove10.reduce((map, obj) => {
          obj.aspects.forEach(e => {
            if (map.has(e)) {
              map.set(e, map.get(e)! + 1);
            }
            else {
              map.set(e, 1);
            }
          });
          return map;
        }, new Map<number, number>());
        const activeIds = getSids(entry);
        const activeTradition = last(getSids(get(dependent, 'SA_86') as SpecialAbilityInstance));
        const sel = sortObjects(entry.sel!.filter(e => getTraditionOfAspect(e.id as number) === activeTradition && counter.get(e.id as number)! >= 3 && !activeIds.includes(e.id) && !getDSids(entry).includes(e.id)), locale.id);
        if (sel.length > 0) {
          const apArr = [15, 25, 45];
          const cost = apArr[active.length];
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_231': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id) && (get(dependent, id) as SpellInstance).value >= 10);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_338': {
        type EnhancedSelectionObject = SelectionObject & { gr: number; tier: number; };
        let sel = entry.sel as EnhancedSelectionObject[];
        if (isActive(entry)) {
          const selectedPath = (getSelectionItem(entry, entry.active[0].sid) as EnhancedSelectionObject).gr;
          const lastTier = (getSelectionItem(entry, entry.active[entry.active.length - 1].sid) as EnhancedSelectionObject).tier;
          sel = sel.filter(e => e.gr === selectedPath && e.tier === lastTier + 1);
        }
        else {
          sel = sel.filter(e => e.tier === 1);
        }
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_414':
      case 'SA_663': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.reduce<SelectionObject[]>((arr, e) => {
          const targetInstance = id === 'SA_414' ? dependent.spells.get(e.target!) : dependent.liturgies.get(e.target!);
          if (!activeIds.includes(e.id) && validate(state, e.req!, id, pact) && !getDSids(entry).includes(e.id) && typeof targetInstance === 'object' && targetInstance.value >= e.tier! * 4 + 4) {
            return [...arr, { ...e, name: `${targetInstance.name}: ${e.name}` }];
          }
          return arr;
        }, []);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_533': {
        const sel = Array.isArray(entry.sel) ? sortObjects(entry.sel, locale.id) : undefined;
        if (tiers && maxTier === 0) {
          break;
        }
        const increaseValue = dependent.talents.get(dependent.specialAbilities.get('SA_531')!.active[0].sid as string)!.ic;
        const increasedCost = (cost as number[]).map(e => e + increaseValue);
        return { id, name, cost: increasedCost, sel, instance: entry };
      }
      case 'SA_544':
      case 'SA_545':
      case 'SA_546':
      case 'SA_547':
      case 'SA_548': {
        if (isActive(dependent.advantages.get('ADV_77'))) {
          let max = 3;
          if (isActive(dependent.advantages.get('ADV_79'))) {
            max += dependent.advantages.get('ADV_79')!.active[0].tier!;
          }
          else if (isActive(dependent.advantages.get('DISADV_72'))) {
            max -= dependent.advantages.get('DISADV_72')!.active[0].tier!;
          }
          const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, instance: entry };
          }
        }
        else if (isActive(dependent.advantages.get('ADV_12'))) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_549':
      case 'SA_550':
      case 'SA_551':
      case 'SA_552':
      case 'SA_553': {
        if (isActive(dependent.advantages.get('ADV_78'))) {
          let max = 3;
          if (isActive(dependent.advantages.get('ADV_80'))) {
            max += dependent.advantages.get('ADV_80')!.active[0].tier!;
          }
          else if (isActive(dependent.advantages.get('DISADV_73'))) {
            max -= dependent.advantages.get('DISADV_73')!.active[0].tier!;
          }
          const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, instance: entry };
          }
        }
        else if (isActive(dependent.advantages.get('ADV_12'))) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_639': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && validate(state, e.prerequisites!, id, pact) && !getDSids(entry).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }
      case 'SA_667': {
        return { id, name, cost, tiers, maxTier: pact!.level, instance: entry };
      }
      case 'SA_677':
      case 'SA_678':
      case 'SA_679':
      case 'SA_680': {
        const {
          spentOnMagicalAdvantages,
          spentOnMagicalDisadvantages,
        } = adventurePoints;

        const magicalTraditions = getMagicalTraditionsResultFunc(dependent.specialAbilities);

        if (
          spentOnMagicalAdvantages <= 25 &&
          spentOnMagicalDisadvantages <= 25 &&
          magicalTraditions.length === 0
        ) {
          return { id, name, cost, instance: entry };
        }
        break;
      }
      case 'SA_699': {
        const languages = dependent.specialAbilities.get('SA_29')!;

        interface AvailableLanguage {
          id: number;
          tier: number;
        }

        const availableLanguages = languages.active.reduce<AvailableLanguage[]>((arr, obj) => {
          if (obj.tier === 3 || obj.tier === 4) {
            return [
              ...arr,
              {
                id: obj.sid as number,
                tier: obj.tier
              }
            ];
          }
          return arr;
        }, []);

        const sel = languages.sel!.filter(e => {
          const languageAvailable = availableLanguages.find(l => l.id === e.id);
          const firstForLanguage = !entry.active.some(a => a.sid === e.id);
          return languageAvailable && firstForLanguage;
        }).map(e => {
          const languageAvailable = availableLanguages.find(l => l.id === e.id);
          const isMotherTongue = languageAvailable && languageAvailable.tier === 4;
          if (isMotherTongue) {
            return {
              ...e,
              cost: 0
            };
          }
          return e;
        });

        if (sel.length > 0) {
          return { id, name, sel, cost, instance: entry };
        }
        break;
      }

      default: {
        let sel = Array.isArray(entry.sel) ? sortObjects(entry.sel, locale.id) : undefined;
        if (cost === 'sel' && sel) {
          const activeIds = getSids(entry);
          sel = sel.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        }
        if (tiers && maxTier === 0) {
          break;
        }
        return { id, name, cost, tiers, maxTier, input, sel, instance: entry };
      }
    }
  }

  return;
}

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special ability.
 * @param entry The instance.
 */
export function isExtendedSpecialAbility(entry: ActivatableInstance) {
  return entry.category === 'SPECIAL_ABILITIES' && [11, 14, 26].includes(entry.gr);
}

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: ActiveObject[];
  customCostList: ActiveObject[];
}

export function getSplittedActiveObjectsByCustomCost(entries: ActiveObject[]) {
  return entries.reduce<SplittedActiveObjectsByCustomCost>((res, obj) => {
    if (typeof obj.cost === 'number') {
      return {
        ...res,
        customCostList: [
          ...res.customCostList,
          obj,
        ],
      };
    }

    return {
      ...res,
      defaultCostList: [
        ...res.defaultCostList,
        obj,
      ],
    };
  }, {
    defaultCostList: [],
    customCostList: [],
  });
}

export function getActiveWithDefaultCost(entries: ActiveObject[]) {
  return getSplittedActiveObjectsByCustomCost(entries).defaultCostList;
}

export function getTraditionNameFromFullName(name: string): string {
	const result = /\((.+)\)/.exec(name);
	if (result === null) {
		return '';
	}
	return result[1];
}

export function calculateAdventurePointsSpentDifference(entries: ActiveViewObject[], state: Map<string, ActivatableInstance>, wiki: WikiState): number {
  let diff = 0;

  // impure
  const calculatePrinciplesObligationsDiff = (sourceId: string) => {
    if (entries.some(e => e.id === sourceId)) {
      const { active } = state.get(sourceId)!;

      const maxCurrentTier = active.reduce((a, b) => {
        const isNotCustom = b.cost === undefined;
        if (typeof b.tier === 'number' && b.tier > a && isNotCustom) {
          return b.tier;
        }
        return a;
      }, 0);

      // next lower tier
      const subMaxCurrentTier = active.reduce((a, b) => {
        const isNotCustom = b.cost === undefined;
        if (
          typeof b.tier === 'number' &&
          b.tier > a &&
          b.tier < maxCurrentTier &&
          isNotCustom
        ) {
          return b.tier;
        }
        return a;
      }, 0);

      const amountMaxTiers = active.reduce((a, b) => {
        if (maxCurrentTier === b.tier) {
          return a + 1;
        }
        return a;
      }, 0);

      const baseCost = wiki.disadvantages.get(sourceId)!.cost as number;
      const amountDiff = amountMaxTiers > 1 ? maxCurrentTier * -baseCost : 0;
      const levelDiff = subMaxCurrentTier * -baseCost;

      diff += amountDiff + levelDiff;
    }
  }

  calculatePrinciplesObligationsDiff('DISADV_34');
  calculatePrinciplesObligationsDiff('DISADV_50');

  if (entries.some(e => e.id === 'DISADV_33')) {
    const { active } = state.get('DISADV_33')!;
    if (active.filter(e => e.sid === 7 && e.cost === undefined).length > 1) {
      diff -= wiki.disadvantages.get('DISADV_33')!.select!.find(e => e.id === 7)!.cost!;
    }
  }

  if (entries.some(e => e.id === 'DISADV_36')) {
    const { active } = state.get('DISADV_36')!;
    if (getActiveWithDefaultCost(active).length > 3) {
      diff -= (wiki.disadvantages.get('DISADV_36')!.cost as number) * 3;
    }
  }

  if (entries.some(e => e.id === 'SA_9')) {
    const { active } = state.get('SA_9')!;
    const sameSkill = new Map<string, number>();
    const skillDone = new Map<string, number>();

    for (const { sid } of active) {
      const id = sid as string;
      if (sameSkill.has(id)) {
        sameSkill.set(id, sameSkill.get(id)! + 1);
      }
      else {
        sameSkill.set(id, 1);
      }
    }

    for (const { sid } of active) {
      const id = sid as string;
      const counter = sameSkill.get(id)!;
      if (!skillDone.has(id) || skillDone.get(id)! < counter) {
        const current = skillDone.get(id) || 0;
        const skill = wiki.skills.get(id)!;
        diff += skill.ic * (current + 1 - counter);
        skillDone.set(id, current + 1);
      }
    }
  }

  if (entries.some(e => e.id === 'SA_72')) {
    const apArr = [10, 20, 40];
    const { active } = state.get('SA_72')!;
    diff += apArr.reduce((a, b, i) => i + 1 < active.length ? a + b : a, 0) - apArr[active.length - 1] * (active.length - 1);
  }

  if (entries.some(e => e.id === 'SA_87')) {
    const apArr = [15, 25, 45];
    const { active } = state.get('SA_87')!;
    diff += apArr.reduce((a, b, i) => i + 1 < active.length ? a + b : a, 0) - apArr[active.length - 1] * (active.length - 1);
  }

  return diff;
}

export function isActiveViewObject(obj: ActiveViewObject | DeactiveViewObject): obj is ActiveViewObject {
  return obj.hasOwnProperty('index');
}

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

export function compressList(list: (ActiveViewObject | string)[], locale: UIMessages): string {
	const listToString = sortStrings(list.filter(obj => typeof obj === 'string' || !['SA_27', 'SA_29'].includes(obj.id)).map(obj => {
		if (typeof obj === 'string') {
			return obj;
		}
		return obj.name;
	}), locale.id);

	const finalList = listToString.reduce<EnhancedReduce>((previous, current) => {
		const prevElement = last(previous.final);
		if (prevElement && prevElement.split(' (')[0] === current.split(' (')[0] && /\(.+\)(?: [IVX]+)?$/.test(prevElement)) {
			const prevElementSplitted = prevElement.split(/\)/);
			const optionalTier = prevElementSplitted.pop() || '';
			const beginning = `${prevElementSplitted.join(')')}${optionalTier}`;
			const currentSplitted = current.split(/\(/);
			const continuing = currentSplitted.slice(1).join('(').replace(/\)((?: [IVX]+)?)$/, '$1)');

			const other = previous.final.slice(0, -1);

			return {
				...previous,
				final: [ ...other, `${beginning}, ${continuing}` ]
			};
		}
		return {
			final: [ ...previous.final, current ],
			previousLowerTier: false
		};
	}, {
		final: [],
		previousLowerTier: false
	}).final.join(', ');

	return finalList;
}
