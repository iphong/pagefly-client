import React, {Component, FormEvent, RefObject} from 'react';
import IFrame from 'components/IFrame';
import {Container, Provider, Subscribe} from 'unstated-x';

const SelectedContainer = new Container({
	selected: null
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
					123123
					<IFrame>
						<div>

							<Paragraph/>
						</div>

					</IFrame>

					<Subscribe to={[SelectedContainer]}>
						{({state: {selected}}) => {
							return selected && <Inspector target={selected}/>
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
		setState: Function
	}
}> {

	render() {

		const {target} = this.props
		console.log(target)
		window.selected = target
		return <div>
			<input value={target.state.value} onChange={e => target.setState({value: e.target.value})}/>
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
				...data
			}
			this.container = new Container(this.state)
		}

		render() {
			return (
				<Element container={this.container}/>
			)
		}

	}
}

const Paragraph = createElement({})(
	class extends React.Component {

		get content() {
			return this.contentEditable.current
		}

		state: ParagraphState = {
			value: 'Hello world!'
		}
		lastHtml: string = ''

		componentDidMount() {
			this.content.innerHTML = this.state.value

			SelectedContainer.setState({
				selected: this
			})
		}

		contentEditable: RefObject<HTMLSpanElement> = React.createRef()

		emitChange = (e: FormEvent<HTMLSpanElement>) => {
			const target: HTMLElement = e.currentTarget
			const html = target.innerHTML
			if (html !== this.lastHtml) {
				console.log('setValue', html)
				this.updateValue(html)
			}
			this.lastHtml = html
		}

		updateValue = (value: string) => this.setState({value})

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
