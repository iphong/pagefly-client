import React, {Component, ComponentClass, ComponentElement, FormEvent, RefObject} from 'react';
import {Container, Subscribe} from 'unstated-x';
import {SelectedContainer} from 'containers';
import uuid from 'uuid';

export interface PFElementInterface extends ComponentClass{
	type: string
}

export const elementInstances = new Map()

window.elementInstances = elementInstances

export const createElement = (settings: object) => (Element: PFElementInterface) => {

	return class PFElement extends Component<any, any> {
		stateContainer: any

		DOMNodeRef: RefObject<HTMLElement> = React.createRef()
		elementRef: RefObject<Component> = React.createRef()
		styledRefs: RefObject<Component> = React.createRef()
		id: string = this.props.id || uuid()
		static type = Element.type
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
			elementInstances.set(this.id, this)
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
		get computedStyle() {
			return getComputedStyle(this.DOMNode)
		}
		handlePointerDown = (e: MouseEvent) => {
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this,
				selector: this.selector
			})
		}

		render() {
			const className = 'pf-' + this.id.split('-')[0]
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
								className,
								draggable: true,
								'data-element': this.id

						}}
							ref={this.elementRef}
						/>
					}}
				</Subscribe>
			)
		}

	}

}
