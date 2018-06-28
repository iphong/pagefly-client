import React from 'react';
import {Container, Subscribe} from 'unstated-x';
import {SelectedContainer, StyleContainer} from '../containers';
import IFrame from '../components/IFrame';
import styled from 'styled-components';

function getStyleSheet(document: Document, device: string) {
	const styleSheetList: StyleSheetList = document.styleSheets
	return Array.from(styleSheetList)
		.filter((s: CSSStyleSheet) =>
			s.ownerNode.isEqualNode(document.querySelector(`style[data-pagefly-css="${device}"]`)))[0]
}

function isValidJsonString(str: string) {
	let json
	try {
		json = JSON.parse(str);
	} catch (e) {
		return false;
	}
	return json;
}

export const allStyle = new StyleContainer()
export const mobileStyle = new StyleContainer()

window.allStyle = allStyle

export default class Inspector extends React.Component<{frame: IFrame}> {
	styleSheets: {
		all: CSSStyleSheet,
		mobile: CSSStyleSheet
	}
	get frameWindow() {
		return this.props.frame.window
	}
	get frameDocument() {
		return this.props.frame.document
	}
	state = {
		style: ''
	}
	componentDidMount() {

		const all = getStyleSheet(this.frameDocument, 'all') as CSSStyleSheet
		const mobile = getStyleSheet(this.frameDocument, 'mobile') as CSSStyleSheet
		mobile.disabled = true
		allStyle.instance = all
		mobileStyle.instance = mobile

		window.inspector = this
	}

	saveStyle = (selector: string) => {
		const style = isValidJsonString(this.state.style)
		if (style) {
			allStyle.setStyle(selector, style)
		}
	}

	render() {
		return <Subscribe to={[SelectedContainer]}>
				{({state: {selected, selector}}) => {
					const {stateContainer, styleContainer} = selected
					return selected && stateContainer && styleContainer && <Subscribe to={[stateContainer, styleContainer]}>
						{(stateCon, styleCon) => <div>
								<Input onChange={(value: string) => stateCon.setStateSync({value})} value={stateCon.state.value} />

						<div>
							Style: <TextArea value={this.state.style} onChange={e => this.setState({style: e.target.value})} />
							<button onClick={() => this.saveStyle(selector)}>Save Style</button>
						</div>
						</div>}
					</Subscribe>
				}}
			</Subscribe>

	}
}

const Input: React.SFC<{value: string, onChange: Function}> = ({value, onChange}) => {

	return <input value={value} onChange={e => onChange(e.target.value)}/>
}

const TextArea = styled.textarea`

`