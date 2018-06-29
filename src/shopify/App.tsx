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
import {createPFElement} from 'helpers/createElement';
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
	},
	Section: {
		type: 'Section',
		load: () => import('elements/Section.tsx')
	}
}

class ElementLoader extends React.Component<{type: string, data?: object, container?: ElementContainer}> {

	state = {
		Instance: (): Component => null
	}

	componentDidMount() {
		this.loadElement()
	}

	componentDidUpdate(prevProps: {type: string}) {
		console.log('did update')
		if (prevProps.type !== this.props.type) {
			this.loadElement()
		}
	}

	loadElement = async () => {
		const {type} = this.props
		const Instance = (await ElementComponents[type].load()).default
		console.log(Instance)
		this.setState({Instance})
	}

	render() {
		const {Instance} = this.state
		return <Subscribe to={[this.props.container]}>
			{container => <Instance container={container} {...container.state} />}
		</Subscribe>
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
		return items.map((item: ItemType, key: number) => (
			<ElementLoader key={item.id || key} type={item.type} data={item.data}/>
		))
	}

	render() {

		return this.renderChildren(this.state.items)
	}
}
export type ElementContainerState = {
	type: string
	children: Array<string|number>
	data: object
}
export class ElementContainer extends Container<ElementContainerState> {}

const items: { [type: string]: ElementContainer } = window.items = {
	1: new ElementContainer({ type: 'Section', children: [2], data: {} }),
	2: new ElementContainer({ type: 'Button', children: [], data: {} })
}
export const renderElement = function (id: string | number): ReactNode {
	const container: ElementContainer = items[id]
	const type = container.state.type
	return <ElementLoader type={type} container={container} />
}
window.addNewItem = function addNewItem(id: number, type: string): void {
	items[id] = new ElementContainer({ type, children: [], data: {}})
}
class App extends Component {

	state: {frame: IFrame} = {
		frame: null
	}

	render() {
		const {frame} = this.state
		return (
			<Provider>
				{renderElement(1)}
			</Provider>
		);
	}
}

export default App;
