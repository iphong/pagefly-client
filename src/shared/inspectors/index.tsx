import React from 'react';
import {Container, Subscribe} from 'unstated-x';
import {SelectedContainer} from '../containers';
import IFrame from '../components/IFrame';

function getStyleSheet(document: Document, device: string) {
	const styleSheetList: StyleSheetList = document.styleSheets
	return Array.from(styleSheetList)
		.filter((s: CSSStyleSheet) =>
			s.ownerNode.isEqualNode(document.querySelector(`style[data-pagefly-css="${device}"]`)))[0]
}

export default class Inspector extends React.Component<{frame: IFrame}> {
	allStyleSheets: CSSStyleSheet
	mobileStyleSheets: CSSStyleSheet
	get frameWindow() {
		return this.props.frame.window
	}
	get frameDocument() {
		return this.props.frame.document
	}
	componentDidMount() {
		console.log(this.frameDocument.styleSheets)
		this.allStyleSheets = getStyleSheet(this.frameDocument, 'all') as CSSStyleSheet
		this.mobileStyleSheets = getStyleSheet(this.frameDocument, 'mobile') as CSSStyleSheet
		console.log(this.allStyleSheets, this.mobileStyleSheets)

	}

	render() {
		return <Subscribe to={[SelectedContainer]}>
				{({state: {selected}}) => {
					const {stateContainer, styleContainer} = selected
					return selected && stateContainer && styleContainer && <Subscribe to={[stateContainer, styleContainer]}>
						{(stateCon, styleCon) => <div>
								<Input onChange={(value: string) => stateCon.setStateSync({value})} value={stateCon.state.value} />
						</div>}
					</Subscribe>
				}}
			</Subscribe>

	}
}

const Input: React.SFC<{value: string, onChange: Function}> = ({value, onChange}) => {

	return <input value={value} onChange={e => onChange(e.target.value)}/>
}