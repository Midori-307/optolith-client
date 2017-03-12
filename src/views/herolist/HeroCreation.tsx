import * as React from 'react';
import * as HerolistActions from '../../actions/HerolistActions';
import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';
import ELStore from '../../stores/ELStore';

interface Props {
	node?: HTMLDivElement;
}

interface State {
	name: string;
	gender: string;
	el: string;
}

export default class HeroCreation extends React.Component<Props, State> {
	state = {
		el: 'EL_0',
		gender: '',
		name: '',
	};

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as State);
	changeGender = (gender: string) => this.setState({ gender } as State);
	changeEL = (el: string) => this.setState({ el } as State);
	create = () => HerolistActions.createHero(this.state.name, this.state.gender as 'm' | 'f', this.state.el);

	render() {
		const experienceLevels = Object.keys(ELStore.getAll()).map(e => {
			const { id, name, ap } = ELStore.get(e);
			return { id, name: `${name} (${ap} AP)` };
		});

		return (
			<Dialog id="herocreation" title="Heldenerstellung" node={this.props.node} buttons={[
				{
					disabled: this.state.name === '' || this.state.gender === '' || this.state.el === 'EL_0',
					label: 'Starten',
					onClick: this.create,
					primary: true,
				},
			]}>
				<TextField hint="Name des Helden" value={this.state.name} onChange={this.changeName} fullWidth />
				<Dropdown
					value={this.state.gender}
					onChange={this.changeGender}
					options={[{id: 'm', name: 'männlich'}, {id: 'f', name: 'weiblich'}]}
					hint="Geschlecht auswählen"
					fullWidth />
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={experienceLevels}
					hint="Erfahrungsgrad auswählen"
					fullWidth />
			</Dialog>
		);
	}
}