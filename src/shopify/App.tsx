import * as React from 'react'
import registry, { ContainerState } from './Registry'
import elements from './Elements'
import { ReactNode } from 'react'
import { Container, Subscribe, SubscribeOne, Provider } from 'unstated-x'
import uuid from 'uuid'

export function renderElement(id: number): ReactNode {
	const container = registry[id]
	const type = container.state.type
	const Component = elements[type]
	return <Subscribe to={[container]} key={container.state.id}>
		{() => {
			const children = container.state.children.map(renderElement)
			return <Component {...container.state.data} children={children} />
		} }
	</Subscribe>
}
export function addElement(parentID: number, type: string, data: object = {}) {
	const nextID: number = parseInt(Object.keys(registry).reverse()[0]) + 1
	registry[nextID] = new Container({ id: uuid(), type, data, children: [] })
	const parentContainer: Container<ContainerState> = registry[parentID]
	const newState:{  children: number[] } = { children: [...(parentContainer.state.children || []), nextID] }
	parentContainer.setState(newState)
}

window.addElement = addElement
window.elements = elements
window.registry = registry

export default class App extends React.Component {
	state: {selected: number} = {
		selected: -1
	}
	componentDidMount() {
		window.app = this
	}
	render() {
		let inspector = null
		if (this.state.selected !== -1) {
			const type = registry[this.state.selected].state.type
			inspector = elements[type].inspector()
		}
		return <Provider>
			<div>
				{renderElement(0)}
				{inspector}
			</div>
		</Provider>
	}
}

// import React, {
// 	Component,
// 	ComponentType,
// 	createRef,
// 	EventHandler,
// 	FormEvent,
// 	ReactNode,
// 	ReactType,
// 	RefObject, SyntheticEvent
// } from 'react';
// import IFrame from 'components/IFrame';
// import {Container, Provider, Subscribe} from 'unstated-x';
// import {findDOMNode} from 'react-dom';
// import {SelectedContainer} from 'containers';
// import {createPFElement} from 'helpers/createElement';
// import Inspector from 'inspectors';
// import uuid from 'uuid'
// import Section from '../shared/elements/Section';
// import styled from 'styled-components';
// import Button from '../shared/elements/Button';
//
// window.uuid = uuid
//
// const DragDropWrapper = styled.div`
// 	user-select: none;
// 	height: 70%;
// 	width: 70%;
// 	position: fixed;
// 	top: 0;
// 	left: 0;
// 	background-color: darkgray;
// `
//
// interface CustomDragEvent<HTMLElement> extends DragEvent{
//
// }
//
// class Page extends React.Component {
//
// 	handleDragStart = (event: SyntheticEvent) => {
// 		console.log(event.target)
// 	}
//
// 	render() {
// 		return <DragDropWrapper onDragStartCapture={this.handleDragStart}>
// 			{this.props.children}
// 		</DragDropWrapper>
// 	}
// }
//
// type ItemType = {
// 	id: string,
// 	type: string,
// 	data: {
//
// 	}
// }
// type ElementState = {
// 	items: ItemType[]
// }
//
// const ElementComponents: {
// 	[type: string]: {
// 		type: string
// 		load: Function
// 	}
// } = {
// 	Paragraph: {
// 		type: 'Paragraph',
// 		load: () => import('elements/Paragraph.tsx')
// 	},
// 	Button: {
// 		type: 'Button',
// 		load: () => import('elements/Button.tsx')
// 	},
// 	Section: {
// 		type: 'Section',
// 		load: () => import('elements/Section.tsx')
// 	}
// }
//
// class ElementLoader extends React.Component<{type: string, data?: object, container?: ElementContainer}> {
//
// 	state = {
// 		Instance: (): Component => null
// 	}
//
// 	componentDidMount() {
// 		this.loadElement()
// 	}
//
// 	componentDidUpdate(prevProps: {type: string}) {
// 		console.log('did update')
// 		if (prevProps.type !== this.props.type) {
// 			this.loadElement()
// 		}
// 	}
//
// 	loadElement = async () => {
// 		const {type} = this.props
// 		const Instance = (await ElementComponents[type].load()).default
// 		console.log(Instance)
// 		this.setState({Instance})
// 	}
//
// 	render() {
// 		const {Instance} = this.state
// 		return <Subscribe to={[this.props.container]}>
// 			{container => <Instance container={container} {...container.state} />}
// 		</Subscribe>
// 	}
// }
//
// class Element extends React.Component {
//
// 	state: ElementState = {
// 		items: []
// 	}
//
// 	componentDidMount() {
// 		window.element = this
// 	}
//
// 	renderChildren = (items: ItemType[]) => {
// 		return items.map((item: ItemType, key: number) => (
// 			<ElementLoader key={item.id || key} type={item.type} data={item.data}/>
// 		))
// 	}
//
// 	render() {
//
// 		return this.renderChildren(this.state.items)
// 	}
// }
// export type ElementContainerState = {
// 	type: string
// 	children: Array<string|number>
// 	data: object
// }
// export class ElementContainer extends Container<ElementContainerState> {}
//
// const items: { [type: string]: ElementContainer } = window.items = {
// 	1: new ElementContainer({ type: 'Section', children: [2], data: {} }),
// 	2: new ElementContainer({ type: 'Button', children: [], data: {} })
// }
// export const renderElement = function (id: string | number): ReactNode {
// 	const container: ElementContainer = items[id]
// 	const type = container.state.type
// 	return <ElementLoader type={type} container={container} />
// }
// window.addNewItem = function addNewItem(id: number, type: string): void {
// 	items[id] = new ElementContainer({ type, children: [], data: {}})
// }
//
// const A = styled.div`
// 	color: ${props => (props.color || 'red')};
// `
// const B = A.extend`
// 	color: blue;
// `
// const C = styled.div`
// 	${A} {
// 		color: green;
// 	}
// `
//
// import Frame from 'react-portal-frame'
//
// class App extends Component {
//
// 	state: {frame: IFrame} = {
// 		frame: null
// 	}
//
// 	render() {
// 		const {frame} = this.state
// 		return (
// 			<div onClick={e => console.log('click')}>
// 				<A>Outside</A>
// 				<Frame>
// 					<A>Hello World</A>
// 					<C>
// 						<A onClick={e => console.log('clicked element')}>jfhdjhfgsfhjds</A>
// 					</C>
// 					<A color="yellow">Hello World</A>
// 					<A color="purple">Hello World</A>
// 					<B>Hello World</B>
// 				</Frame>
// 			</div>
// 		);
// 	}
// }
//
// export default App;
