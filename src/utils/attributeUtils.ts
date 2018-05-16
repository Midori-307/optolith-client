import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { convertMapToValues } from './collectionUtils';
import { flattenDependencies } from './flattenDependencies';
import { Maybe } from './maybe';

export const getSum = (list: Data.AttributeDependent[]): number => {
  return list.reduce((n, e) => n + e.value, 0);
};

export const isIncreasable = (
  wiki: WikiState,
  state: Data.HeroDependent,
  instance: Data.AttributeDependent,
): boolean => {
  if (state.phase < 3) {
    const attributes = convertMapToValues(state.attributes);
    return R.defaultTo(
      false,
      Maybe(wiki.experienceLevels.get(state.experienceLevel))
        .fmap(startEl => {
          const total = getSum(attributes);
          const reachedMaxTotal = total >= startEl.maxTotalAttributeValues;

          if (reachedMaxTotal) {
            return false;
          }

          return instance.value < startEl.maxAttributeValue + instance.mod;
        })
        .value
    );
  }
  else if (state.rules.attributeValueLimit === true) {
    const currentExperienceLevellId = getExperienceLevelIdByAp(
      wiki.experienceLevels,
      state.adventurePoints.total,
    );

    return R.defaultTo(
      false,
      Maybe(wiki.experienceLevels.get(currentExperienceLevellId))
        .fmap(currentEl => {
          return instance.value < currentEl.maxAttributeValue + 2;
        })
        .value
    );
  }

  return true;
};

export const isDecreasable = (
  wiki: WikiState,
  state: Data.HeroDependent,
  instance: Data.AttributeDependent,
): boolean => {
  const dependencies = flattenDependencies(
    wiki,
    state,
    instance.dependencies,
  );

  return instance.value > Math.max(8, ...dependencies);
};

export function convertId<T extends string | undefined>(id: T): T {
  switch (id) {
    case 'COU':
      return 'ATTR_1' as T;
    case 'SGC':
      return 'ATTR_2' as T;
    case 'INT':
      return 'ATTR_3' as T;
    case 'CHA':
      return 'ATTR_4' as T;
    case 'DEX':
      return 'ATTR_5' as T;
    case 'AGI':
      return 'ATTR_6' as T;
    case 'CON':
      return 'ATTR_7' as T;
    case 'STR':
      return 'ATTR_8' as T;

    default:
      return id;
  }
}
