import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { Hero, InputTextEvent, User } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { Book, ExperienceLevel } from '../../types/wiki';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';
import { HeroCreation } from './HeroCreation';
import { HerolistItem } from './HerolistItem';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';

export interface HerolistOwnProps {
	locale: UIMessages;
}

export interface HerolistStateProps {
	currentHero: CurrentHeroInstanceState;
	currentHeroAdventurePoints: AdventurePointsObject;
	currentHeroId: string | undefined;
	experienceLevels: Map<string, ExperienceLevel>;
	list: Hero[];
	users: Map<string, User>;
	visibilityFilter: string;
	sortOrder: string;
	isCharacterCreatorOpen: boolean;
	sortedBooks: Book[];
}

export interface HerolistDispatchProps {
	loadHero(id?: string): void;
	showHero(): void;
	saveHeroAsJSON(id?: string): void;
	deleteHero(id?: string): void;
	duplicateHero(id?: string): void;
	createHero(name: string, sex: 'm' | 'f', el: string, enableAllRuleBooks: boolean, enabledRuleBooks: Set<string>): void;
	importHero(): void;
	setSortOrder(id: string): void;
	setVisibilityFilter(id: string): void;
	openCharacterCreator(): void;
	closeCharacterCreator(): void;
}

export type HerolistProps = HerolistStateProps & HerolistDispatchProps & HerolistOwnProps;

export interface HerolistState {
	filterText: string;
	showHeroCreation: boolean;
}

export class Herolist extends React.Component<HerolistProps, HerolistState> {
	state = {
		filterText: '',
		showHeroCreation: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as HerolistState);

	render() {
		const {
			currentHero: {
				dependent: {
					races,
					raceVariants,
					cultures,
					professions,
					professionVariants
				},
				el: { startId },
				profile: { avatar, professionName, sex },
				rcp: { culture, profession, professionVariant, race, raceVariant }
			},
			currentHeroAdventurePoints,
			currentHeroId,
			importHero,
			list: rawList,
			locale,
			setSortOrder,
			setVisibilityFilter,
			sortOrder,
			users,
			visibilityFilter,
			isCharacterCreatorOpen,
			openCharacterCreator,
			closeCharacterCreator,
			...other
		} = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(rawList.filter(e => {
			if (visibilityFilter === 'own') {
				return !e.player;
			}
			else if (visibilityFilter === 'shared') {
				return !!e.player;
			}
			return true;
		}), locale.id, filterText, sortOrder === 'datemodified' ? [{ key: hero => hero.dateModified.valueOf(), reverse: true }, 'name'] : ['name']).map(hero => (
			<HerolistItem
				{...other}
				key={hero.id}
				id={hero.id}
				name={hero.name}
				ap={hero.ap}
				avatar={hero.avatar}
				c={hero.c}
				p={hero.p}
				player={typeof hero.player === 'string' ? users.get(hero.player) : undefined}
				pv={hero.pv}
				r={hero.r}
				rv={hero.rv}
				sex={hero.sex}
				professionName={hero.professionName}
				races={races}
				raceVariants={raceVariants}
				cultures={cultures}
				professions={professions}
				professionVariants={professionVariants}
				currentHeroId={currentHeroId}
				locale={locale}
				/>
		));

		return (
			<Page id="herolist">
				<Options>
					<TextField
						hint={translate(locale, 'options.filtertext')}
						value={filterText}
						onChange={this.filter}
						fullWidth
						/>
					<Dropdown
						value={visibilityFilter}
						onChange={setVisibilityFilter}
						options={[
							{ id: 'all', name: translate(locale, 'heroes.options.filter.all') },
							{ id: 'own', name: translate(locale, 'heroes.options.filter.own') },
							{ id: 'shared', name: translate(locale, 'heroes.options.filter.shared') },
						]}
						fullWidth
						/>
					<RadioButtonGroup
						active={sortOrder}
						onClick={setSortOrder}
						array={[
							{
								name: translate(locale, 'options.sortorder.alphabetically'),
								value: 'name',
							},
							{
								name: translate(locale, 'options.sortorder.datemodified'),
								value: 'datemodified',
							},
						]}
						/>
					<BorderButton label={translate(locale, 'heroes.actions.create')} onClick={openCharacterCreator} primary />
					<BorderButton label={translate(locale, 'heroes.actions.import')} onClick={importHero} />
				</Options>
				<Scroll>
					<List>
						{
							currentHeroId === undefined && startId !== undefined && (
								<HerolistItem
									{...other}
									avatar={avatar}
									name={translate(locale, 'heroes.view.unsavedhero.title')}
									ap={currentHeroAdventurePoints}
									r={race}
									rv={raceVariant}
									c={culture}
									p={profession}
									pv={professionVariant}
									sex={sex}
									professionName={professionName}
									races={races}
									raceVariants={raceVariants}
									cultures={cultures}
									professions={professions}
									professionVariants={professionVariants}
									locale={locale}
									/>
							)
						}
						{list}
					</List>
				</Scroll>
				<HeroCreation
					{...this.props}
					close={closeCharacterCreator}
					isOpened={isCharacterCreatorOpen}
					/>
			</Page>
		);
	}
}
