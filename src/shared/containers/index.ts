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
		console.log('setStyle', selector, style)
		const cssRules = Array.from(this.instance.cssRules)
		let rule = cssRules.find((s: CSSStyleRule) => s.selectorText === selector ) as CSSStyleRule

		if (!rule) {
			const ruleIndex = this.instance.insertRule(`${selector} {}`)
			rule = this.instance.cssRules[ruleIndex] as CSSStyleRule
		}
		Object.keys(style).forEach(
			(key: keyof typeof style) => {
				rule.style[key] = style[key]
			}
		)

		this.setState((prevState: {
			[selector: string]: string

		}) => {
			console.log(prevState[selector] ? prevState[selector] : {}, style)
			return {[selector]: Object.assign( prevState[selector] ? prevState[selector] : {}, style)}
		})
		console.log(rule)
	}

	getStyle = (selector: string) => {
		return this.state[selector] || {}
	}
}

window.SelectedContainer = SelectedContainer