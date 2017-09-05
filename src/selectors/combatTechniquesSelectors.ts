import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { AdvantageInstance, AttributeInstance, CombatTechniqueInstance, ExperienceLevel, SpecialAbilityInstance } from '../types/data.d';
import { CombatTechnique, CombatTechniqueWithRequirements } from '../types/view.d';
import { getSids } from '../utils/ActivatableUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getAdvantagesState, getSpecialAbilities } from './activatableSelectors';
import { getAttributes, getMaxAttributeValueByID } from './attributeSelectors';
import { getStartEl } from './elSelectors';
import { getPhase } from './phaseSelectors';

export const getCombatTechniques = (state: AppState) => state.currentHero.present.dependent.combatTechniques;

export const getForSave = createSelector(
	[ getCombatTechniques ],
	combatTechniques => {
		const active: { [id: string]: number } = {};
		for (const [id, { value }] of combatTechniques) {
			if (value > 6) {
				active[id] = value;
			}
		}
		return active;
	}
);

export const getForSheet = createSelector(
	[ getCombatTechniques, getAttributes ],
	(combatTechniques, attributes) => {
		const array: CombatTechnique[] = [];
		for (const [id, entry] of combatTechniques) {
			const { ic, name, primary, value, gr } = entry;
			array.push({
				id,
				name,
				value,
				primary,
				ic,
				gr,
				at: getAt(attributes, entry),
				pa: getPa(attributes, entry)
			});
		}
		return array;
	}
);

export const getAllCombatTechniques = createSelector(
	getCombatTechniques,
	getAttributes,
	mapGetToSlice(getSpecialAbilities, 'SA_19'),
	mapGetToSlice(getAdvantagesState, 'ADV_17'),
	getPhase,
	getStartEl,
	(combatTechniques, attributes, hunter, exceptionalCombatTechnique, phase, startEl) => {
		const array: CombatTechniqueWithRequirements[] = [];
		for (const [id, entry] of combatTechniques) {
			const { ic, name, primary, value, gr } = entry;
			array.push({
				id,
				name,
				value,
				primary,
				ic,
				gr,
				at: getAt(attributes, entry),
				pa: getPa(attributes, entry),
				min: getMin(hunter, combatTechniques, entry),
				max: getMax(exceptionalCombatTechnique, startEl, attributes, phase, entry)
			});
		}
		return array;
	}
);

function getAt(attributes: Map<string, AttributeInstance>, obj: CombatTechniqueInstance): number {
	const array = obj.gr === 2 ? obj.primary : ['ATTR_1'];
	const mod = getPrimaryAttributeMod(attributes, array);
	return obj.value + mod;
}

function getPa(attributes: Map<string, AttributeInstance>, obj: CombatTechniqueInstance): number | undefined {
	const mod = getPrimaryAttributeMod(attributes, obj.primary);
	return obj.gr === 2 || obj.id === 'CT_6' || obj.id === 'CT_8' ? undefined : Math.round(obj.value / 2) + mod;
}

function getMax(exceptionalCombatTechnique: AdvantageInstance | undefined, startEl: ExperienceLevel, attributes: Map<string, AttributeInstance>, phase: number, obj: CombatTechniqueInstance): number {
	let max = 0;
	const bonus = exceptionalCombatTechnique && getSids(exceptionalCombatTechnique).includes(obj.id) ? 1 : 0;

	if (phase < 3) {
		max = startEl.maxCombatTechniqueRating;
	}
	else {
		max = getMaxAttributeValueByID(attributes, obj.primary) + 2;
	}

	return max + bonus;
}

function getMin(hunter: SpecialAbilityInstance | undefined, combatTechniques: Map<string, CombatTechniqueInstance>, obj: CombatTechniqueInstance): number {
	const SA_19_REQ = !!hunter && hunter.active.length > 0 && !![...combatTechniques.values()].find(e => e.gr === 2 && e.value >= 10);

	const maxArray = [6, ...obj.dependencies];

	if (SA_19_REQ && obj.gr === 2) {
		maxArray.push(10);
	}

	return Math.max(...maxArray);
}

function getPrimaryAttributeMod(attributes: Map<string, AttributeInstance>, ids: string[]) {
	return Math.max(Math.floor((getMaxAttributeValueByID(attributes, ids) - 8) / 3), 0);
}