import React, {Component, FormEvent, RefObject} from 'react';
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
						<div>
							<Paragraph/>
						</div>
					</IFrame>

					<Subscribe to={[SelectedContainer]}>
						{({state: {selected}}) => {
							console.log(33333,selected.container.state)
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
			this.state = {
				...Element.defaultProps,
				...data
			}

			console.log(2222, this.state)
			this.container = new Container(this.state)

		}

		componentDidMount() {
			SelectedContainer.setState({
				selected: this
			})
		}

		render() {
			return (
				<Subscribe to={[this.container]}>
					{container => {
						console.log(111, this.state)

						return <Element {...container.state} container={container}/>
					}}
				</Subscribe>
			)
		}

	}
}

const Paragraph = createElement({})(
	class extends React.Component<{value: string, container: Container<any>}> {

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
				<div>
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

)

export default App;
