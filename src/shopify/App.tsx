import React, {Component, FormEvent, ReactNode, RefObject} from 'react';
import IFrame from 'components/IFrame';
import {Container, Provider, Subscribe} from 'unstated-x';

const SelectedContainer = new Container({
	selected: {container: Container}
})

declare global {
	interface Window {
		selected: any;
	}
}

class App extends Component {
	render() {
		return (
			<Provider>
				<div className="App">
					<IFrame>
						<h3>This is demo Element</h3>
						<div>
							<Paragraph1/>
							<Paragraph2/>
							<Paragraph3/>
						</div>
					</IFrame>

					<h3>This is demo control inspector:</h3>
					<Subscribe to={[SelectedContainer]}>
						{({state: {selected}}) => {
							return selected && selected.container.state && <Subscribe to={[selected.container]}>
									{container => <Inspector target={selected} container={container}/>}
							</Subscribe>
						}}
					</Subscribe>

				</div>
			</Provider>
		);
	}
}

type ParagraphState = {
	value: string
}

class Inspector extends React.Component<{
	target: {
		state: { value: string }
		setState: Function,
	},
	container: Container<any>
}> {

	get container() {
		return this.props.container
	}

	render() {
		const {container} = this
		return <div>
			<input value={container.state.value} onChange={e => container.setStateSync({value: e.target.value})}/>
		</div>
	}
}

const createElement = (settings: object) => (Element: any) => {

	return class PFElement extends Component<any, any> {
		container: any
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
			this.container = new Container(containerState)

		}

		handleMouseDown = (e: MouseEvent) => {
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this
			})
		}

		render() {
			return (
				<Subscribe to={[this.container]}>
					{container => {
						console.log(1111, container.state)
						return <Element {...container.state} extraProps={{
							onMouseDown: this.handleMouseDown
						}} container={container}/>
					}}
				</Subscribe>
			)
		}

	}
}

const createElement1 = (settings: object) => (Element: any) => {

	return class PFElement extends Component<any, any> {
		container: any
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
			this.container = new Container(containerState)

		}

		handleMouseDown = (e: MouseEvent) => {
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this
			})
		}

		componentDidMount() {

			console.log(this.element)
			this.element.current.setState = this.container.setStateSync.bind(this.container)
		}

		element: RefObject<Component> = React.createRef()

		render() {
			return (
				<Subscribe to={[this.container]}>
					{container => {
						return <Element  extraProps={{
							onMouseDown: this.handleMouseDown
						}} ref={this.element} {...container.state} container={container}/>
					}}
				</Subscribe>
			)
		}

	}
}

class Paragraph extends React.Component<{value: string, extraProps: object, container: Container<any>}> {

	static defaultProps = {
		value: 'Hello world!'
	}

	get content() {
		return this.contentEditable.current
	}

	get container() {
		return this.props.container
	}

	lastHtml: string = ''

	componentDidMount() {
		this.content.innerHTML = this.props.value
	}

	componentDidUpdate(nextProps: {
		value: string
	}) {
		if (this.props.value !== nextProps.value && !this.content.matches(':focus')) {
			this.content.innerHTML = nextProps.value
		}
	}

	contentEditable: RefObject<HTMLSpanElement> = React.createRef()

	emitChange = (e: FormEvent<HTMLSpanElement>) => {
		const target: HTMLElement = e.currentTarget
		const html = target.innerHTML
		if (html !== this.lastHtml) {
			this.container.setState({value: html})
		}
		this.lastHtml = html
	}

	render() {
		return (
			<div {...this.props.extraProps}>
				  <span
					  contentEditable
					  ref={this.contentEditable}
					  onInput={this.emitChange}
					  onBlur={this.emitChange}
				  />
			</div>
		)
	}
}

class ParagraphTest extends React.Component<{value: string, extraProps: object}> {

	static defaultProps = {
		value: 'Hello'
	}

	render() {
		console.log(this.state, this.props)
		return (
			<div {...this.props.extraProps}>
				  <input value={this.props.value || 'test'} onChange={e => this.setState({value: e.target.value})}/>
			</div>
		)
	}
}

const Paragraph1 = createElement({})(Paragraph)
const Paragraph2 = createElement1({})(Paragraph)
const Paragraph3 = createElement1({})(ParagraphTest)

export default App;
