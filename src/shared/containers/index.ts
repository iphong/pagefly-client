import {Container} from 'unstated-x';

export const SelectedContainer = new Container({
	selected: {container: Container}
})

type StateStyle =  {
	foo: string,
	[selector: string]: string
}
export class StyleContainer extends Container<object> {
	instance: CSSStyleSheet;


	setStyle = (selector: string, style: object) => {
		console.log('setStyle', selector, style)
		const cssRules = Array.from(this.instance.cssRules)
		let rule = cssRules.find((s: CSSStyleRule) => s.selectorText === selector ) as CSSStyleRule

		console.log(rule)
		if (!rule) {
			const ruleIndex = this.instance.insertRule(`${selector} {}`)
			rule = this.instance.cssRules[ruleIndex] as CSSStyleRule
		}
		console.log(rule)
		Object.keys(style).forEach(
			(key: keyof typeof style) => {
				rule.style[key] = style[key]
			}
		)

		this.setState((prevState: {
			[selector: string]: string

		}) => {
			return {[selector]: Object.assign( prevState ? prevState[selector] : {}, style)}
		})

	}
}

window.SelectedContainer = SelectedContainer