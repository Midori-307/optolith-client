import { createSelector } from 'reselect';
import { Categories, ActivatableCategory } from '../constants/Categories';
import { DependentInstancesState } from '../reducers/dependentInstances';
import * as Data from '../types/data.d';
import { convertPerTierCostToFinalCost, getActiveFromState, getNameCost, getSelectionName, getSids, getTraditionNameFromFullName, getValidation, isActive } from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getStateKeyByCategory } from '../utils/IDUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getAllByCategory } from './dependentInstancesSelectors';
import { getBlessedTradition } from './liturgiesSelectors';
import { getMessages } from './localeSelectors';
import { getValidPact } from './pactSelectors';
import { getCultureAreaKnowledge } from './profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from './rcpSelectors';
import { getSpecialAbilitiesSortOptions } from './sortOptionsSelectors';
import { getMagicalTraditions } from './spellsSelectors';
import { getAdvantages, getAdvantagesFilterText, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getLocaleMessages, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki,  } from './stateSelectors';

export function getForSave(state: DependentInstancesState): Data.ToListById<Data.ActiveObject[]> {
  const allEntries = [
    ...getAllByCategory(state, Categories.ADVANTAGES),
    ...getAllByCategory(state, Categories.DISADVANTAGES),
    ...getAllByCategory(state, Categories.SPECIAL_ABILITIES),
  ];
  return allEntries.filter(e => isActive(e)).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
}

export const getActive = <T extends ActivatableCategory>(category: T, addTierToName: boolean) => {
  return createSelector(
    getAdvantages,
    getDisadvantages,
    getSpecialAbilities,
    getCurrentHeroPresent,
    getLocaleMessages,
    getWiki,
    getValidPact,
    (advantages, disadvantages, specialAbilities, state, locale, wiki, pact) => {
      const { dependent } = state;
      const allEntries = (category === Categories.ADVANTAGES ? advantages : category === Categories.DISADVANTAGES ? disadvantages : specialAbilities) as Map<string, Data.InstanceByCategory[T]>;
      const finalEntries: Data.ActiveViewObject<Data.InstanceByCategory[T]>[] = [];

      const activeEntries = getActiveFromState(allEntries);

      for (const activeObject of activeEntries) {
        const {
          id,
          index,
          tier
        } = activeObject;

        const {
          combinedName,
          currentCost,
          cost,
          tierName
        } = convertPerTierCostToFinalCost(getNameCost(activeObject, wiki, dependent, false, locale), locale, addTierToName);

        const {
          disabled,
          maxTier,
          minTier
        } = getValidation(activeObject, state, pact);

        const instance = dependent[getStateKeyByCategory(category)].get(id);

        if (typeof instance === 'object') {
          finalEntries.push({
            id,
            index,
            name: combinedName,
            cost: currentCost,
            disabled,
            instance,
            maxTier,
            minTier,
            tier,
            customCost: typeof cost === 'number',
            tierName
          });
        }
      }

      return finalEntries;
    }
  );
};

export const getActiveForView = <T extends ActivatableCategory>(category: T) => {
  return getActive(category, false);
};

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) => {
  return getActive(category, true);
};

export const getAdvantagesRating = createSelector(
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (race, culture, profession) => {
    const rating: Data.ToListById<string> = {};

    if (race && culture && profession) {
      race.commonAdvantages.forEach(e => { rating[e] = 'TYP'; });
      race.uncommonAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      culture.commonAdvantages.forEach(e => { rating[e] = 'TYP'; });
      culture.uncommonAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      profession.suggestedAdvantages.forEach(e => { rating[e] = 'TYP'; });
      profession.unsuitableAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      race.stronglyRecommendedAdvantages.forEach(e => { rating[e] = 'IMP'; });
    }

    return rating;
  }
);

export const getDisadvantagesRating = createSelector(
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (race, culture, profession) => {
    const rating: Data.ToListById<string> = {};

    if (race && culture && profession) {
      race.commonDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      race.uncommonDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      culture.commonDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      culture.uncommonDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      profession.suggestedDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      profession.unsuitableDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      race.stronglyRecommendedDisadvantages.forEach(e => { rating[e] = 'IMP'; });
    }

    return rating;
  }
);

export const getAdvantagesForSheet = createSelector(
  getActiveForView(Categories.ADVANTAGES),
  active => active
);

export const getAdvantagesForEdit = createSelector(
  getActiveForEditView(Categories.ADVANTAGES),
  active => active
);

export const getFilteredActiveAdvantages = createSelector(
	getAdvantagesForEdit,
	getAdvantagesFilterText,
	getLocaleMessages,
	(spells, filterText, locale) => {
		return filterAndSortObjects(spells, locale!.id, filterText);
	}
);

export const getDisadvantagesForSheet = createSelector(
  getActiveForView(Categories.DISADVANTAGES),
  active => active
);

export const getDisadvantagesForEdit = createSelector(
  getActiveForEditView(Categories.DISADVANTAGES),
  active => active
);

export const getFilteredActiveDisadvantages = createSelector(
	getDisadvantagesForEdit,
	getDisadvantagesFilterText,
	getLocaleMessages,
	(spells, filterText, locale) => {
		return filterAndSortObjects(spells, locale!.id, filterText);
	}
);

export const getSpecialAbilitiesForSheet = createSelector(
  getActiveForView(Categories.SPECIAL_ABILITIES),
  active => active
);

export const getSpecialAbilitiesForEdit = createSelector(
  getActiveForEditView(Categories.SPECIAL_ABILITIES),
  active => active
);

export const getFilteredActiveSpecialAbilities = createSelector(
	getSpecialAbilitiesForEdit,
	getSpecialAbilitiesSortOptions,
	getSpecialAbilitiesFilterText,
	getLocaleMessages,
	(spells, sortOptions, filterText, locale) => {
		return filterAndSortObjects(spells, locale!.id, filterText, sortOptions);
	}
);

export const getGeneralSpecialAbilitiesForSheet = createSelector(
  getSpecialAbilitiesForSheet,
  getMessages,
  getCultureAreaKnowledge,
  (specialAbilities, messages, cultureAreaKnowledge = '') => {
    return [
      ...specialAbilities.filter(e => [1, 2, 22, 30].includes(e.instance.gr!)),
      translate(messages!, 'charactersheet.main.generalspecialabilites.areaknowledge', cultureAreaKnowledge)
    ];
  }
);

export const getCombatSpecialAbilitiesForSheet = createSelector(
  getSpecialAbilitiesForSheet,
  specialAbilities => {
    return specialAbilities.filter(e => [3, 9, 10, 11, 12, 21].includes(e.instance.gr!));
  }
);

export const getMagicalSpecialAbilitiesForSheet = createSelector(
  getSpecialAbilitiesForSheet,
  specialAbilities => {
    return specialAbilities.filter(e => [4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 28].includes(e.instance.gr!));
  }
);

export const getBlessedSpecialAbilitiesForSheet = createSelector(
  getSpecialAbilitiesForSheet,
  specialAbilities => {
    return specialAbilities.filter(e => [7, 8, 23, 24, 25, 26, 27, 29].includes(e.instance.gr!));
  }
);

export const getFatePointsModifier = createSelector(
  mapGetToSlice(getAdvantages, 'ADV_14'),
  mapGetToSlice(getDisadvantages, 'DISADV_31'),
  (luck, badLuck) => {
    const luckActive = luck && luck.active[0];
    const badLuckActive = badLuck && badLuck.active[0];
    if (luckActive) {
      return luckActive.tier!;
    }
    if (badLuckActive) {
      return badLuckActive.tier! * -1;
    }
    return 0;
  }
);

export const getMagicalTraditionForSheet = createSelector(
  getMagicalTraditions,
  specialAbilities => specialAbilities.map(e => getTraditionNameFromFullName(e.name)).join(', ')
);

export const getPropertyKnowledgesForSheet = createSelector(
  mapGetToSlice(getSpecialAbilities, 'SA_72'),
  propertyKnowledge => getSids(propertyKnowledge!).map(e => getSelectionName(propertyKnowledge!, e)!)
);

export const getBlessedTraditionForSheet = createSelector(
  getBlessedTradition,
  tradition => tradition && getTraditionNameFromFullName(tradition.name)
);

export const getAspectKnowledgesForSheet = createSelector(
  mapGetToSlice(getSpecialAbilities, 'SA_87'),
  aspectKnowledge => getSids(aspectKnowledge!).map(e => getSelectionName(aspectKnowledge!, e)!)
);

export const getInitialStartingWealth = createSelector(
  mapGetToSlice(getAdvantages, 'ADV_36'),
  mapGetToSlice(getDisadvantages, 'DISADV_2'),
  (rich, poor) => {
    if (rich && isActive(rich)) {
      return 750 + rich.active[0]!.tier! * 250;
    }
    else if (poor && isActive(poor)) {
      return 750 - poor.active[0]!.tier! * 250;
    }
    return 750;
  }
);

export const isAlbino = createSelector(
  mapGetToSlice(getDisadvantages, 'DISADV_45'),
  stigma => {
    return stigma && getSids(stigma).includes(1);
  }
);
