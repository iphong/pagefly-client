import React, {Component, FormEvent, RefObject} from 'react';
import {Container, Subscribe} from 'unstated-x';
import {SelectedContainer} from 'containers';

export const createElement = (settings: object) => (Element: React.ComponentType) => {

	return class PFElement extends Component<any, any> {
		stateContainer: any
		DOMNodeRef: RefObject<HTMLElement> = React.createRef()
		elementRef: RefObject<Component> = React.createRef()
		styledRefs: RefObject<Component> = React.createRef()
		id: string = Math.random()
			.toString(36)
			.substring(5).replace(/[0-9]/, '')
		constructor(props: {
			data: object
		}, context: object) {
			super(props, context)
			const { data, ...rest } = props
			const containerState = {
				...Element.defaultProps,
				...data
			}

			console.log(2222, containerState)
			this.stateContainer = new Container(containerState)

		}

		get element() {
			return this.elementRef.current
		}
		get DOMNode() {
			return this.DOMNodeRef.current
		}

		get selector() {
			return Array.from(this.DOMNode.classList).map(s => `.${s}`).join('')
		}

		setStyle(value: object) {

		}

		handlePointerDown = (e: MouseEvent) => {
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this,
				selector: this.selector
			})
		}

		render() {
			return (
				<Subscribe to={[this.stateContainer]}>
					{(stateContainer) => {
						return <Element
							{...stateContainer.state}
							onChange={(value: object) => {
								console.log('onChange', value)
								stateContainer.setState(value)
							}}
							extraProps={{
								onPointerDown: this.handlePointerDown,
								innerRef: this.DOMNodeRef,
								ref: this.styledRefs,
								className: this.id

						}}
							ref={this.elementRef}
						/>
					}}
				</Subscribe>
			)
		}

	}

}

export const createElement1 = (settings: object) => (Element: any) => {

	return class PFElement extends Component<any, any> {
		container: any
		constructor(props: {
			data: object
		}) {
			super(props,)
			const { data, ...rest } = props
			const containerState = {
				...Element.defaultProps,
				...data
			}

			console.log(2222, containerState)
			this.container = new Container(containerState)

		}

		handlePointerDown = (e: PointerEvent) => {
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this
			})
		}

		get element() {
			return this.elementRef.current
		}
		get DOMNode() {
			return this.DOMNodeRef.current
		}

		componentDidMount() {
			console.log(this.element, this.DOMNode)
			this.element.setState = this.container.setStateSync.bind(this.container)
		}

		elementRef: RefObject<Component> = React.createRef()
		DOMNodeRef: RefObject<HTMLElement> = React.createRef()

		render() {
			return (
				<Subscribe to={[this.container]}>
					{container => {
						return <Element  extraProps={{
							onPointerDown: this.handlePointerDown,
							ref: this.DOMNodeRef
						}} ref={this.elementRef} {...container.state} container={container}/>
					}}
				</Subscribe>
			)
		}

	}
}
