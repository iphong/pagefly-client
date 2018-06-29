import React, {
	Component,
	ComponentType,
	createRef,
	EventHandler,
	FormEvent,
	ReactNode,
	ReactType,
	RefObject, SyntheticEvent
} from 'react';
import IFrame from 'components/IFrame';
import {Container, Provider, Subscribe} from 'unstated-x';
import {findDOMNode} from 'react-dom';
import {SelectedContainer} from 'containers';
import {createElement} from 'helpers/createElement';
import Inspector from 'inspectors';
import uuid from 'uuid'
import Section from '../shared/elements/Section';
import styled from 'styled-components';
import Button from '../shared/elements/Button';

window.uuid = uuid

const DragDropWrapper = styled.div`
	user-select: none;
	height: 70%;
	width: 70%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: darkgray;
`

interface CustomDragEvent<HTMLElement> extends DragEvent{

}

class Page extends React.Component {

	handleDragStart = (event: SyntheticEvent) => {
		console.log(event.target)
	}

	render() {
		return <DragDropWrapper onDragStartCapture={this.handleDragStart}>
			{this.props.children}
		</DragDropWrapper>
	}
}

type ItemType = {
	id: string,
	type: string,
	data: {

	}
}
type ElementState = {
	items: ItemType[]
}

const ElementComponents: {
	[type: string]: {
		type: string
		load: Function
	}
} = {
	Paragraph: {
		type: 'Paragraph',
		load: () => import('elements/Paragraph.tsx')
	},
	Button: {
		type: 'Button',
		load: () => import('elements/Button.tsx')
	}
}

class ElementLoader extends React.Component<{type: string}> {

	state = {
		Instance: (): Component => null
	}

	async componentDidMount() {
		const {type} = this.props
		const Instance = (await ElementComponents[type].load()).default
		console.log(Instance)
		this.setState({Instance})
	}

	render() {
		const {Instance} = this.state
		return <Instance />
	}
}


class Element extends React.Component {

	state: ElementState = {
		items: []
	}

	componentDidMount() {
		window.element = this
	}

	renderChildren = (items: ItemType[]) => {
		return items.map((item: ItemType, key: number) => <ElementLoader key={item.id || key} type={item.type}/>)
	}

	render() {

		return this.renderChildren(this.state.items)
	}
}

class App extends Component {

	state: {frame: IFrame} = {
		frame: null
	}

	render() {
		const {frame} = this.state
		return (
			<Provider>
				<div className="App">
					<IFrame head={`
						<style data-pagefly-css="all"></style>
						<style data-pagefly-css="mobile"></style>
					`} onLoad={(frame: IFrame) => {
						this.setState({frame})
					}}>
						<h3>This is demo Element</h3>
						<Page>
							<Button />
							<Section />
							<Element />
						</Page>
					</IFrame>

					<h3>This is demo control inspector:</h3>
					{frame && <Inspector frame={frame} />}

				</div>
			</Provider>
		);
	}
}


export default App;
