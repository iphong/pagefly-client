import {Container} from 'unstated-x';

export const SelectedContainer = new Container({
	selected: {container: Container}
})

type StateStyle =  {
	[selector: string]: string
}
export class StyleContainer extends Container<object> {
	instance: CSSStyleSheet;
	state: StateStyle = {}

	setStyle = (selector: string, style: object = {}) => {
		const cssRules = Array.from(this.instance.cssRules)
		let rule = cssRules.find((s: CSSStyleRule) => s.selectorText === selector ) as CSSStyleRule

		if (!rule) {
			const ruleIndex = this.instance.insertRule(`${selector} {}`)
			rule = this.instance.cssRules[ruleIndex] as CSSStyleRule
		}
		const currentStyle = rule.style
		Object.assign(currentStyle, style)
		Object.assign( this.state, {[selector]: style})
		console.log('new Style', currentStyle, this.state)
		this._listeners.forEach(fn => fn(style))
	}

	getStyle = (selector: string)  => {
		return this.state[selector] || {}
	}
}

window.SelectedContainer = SelectedContainer