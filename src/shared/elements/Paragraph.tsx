import React, {FormEvent, RefObject} from 'react';
import {Container} from 'unstated-x';
import styled from 'styled-components'

const P = styled.p`
	& {
		display: inline-block;
		border: rebeccapurple solid 1px;
	}

`

export class ParagraphTest extends React.Component<{ value: string, extraProps: object }> {

	static defaultProps = {
		value: 'Hello'
	}

	render() {
		console.log(this.state, this.props)
		return (
			<P {...this.props.extraProps}>
				<input value={this.props.value || 'test'} onChange={e => this.setState({value: e.target.value})}/>

			</P>
		)
	}
}

export class Paragraph extends React.Component<{ value: string, extraProps: object, container: Container<any>, onChange: Function }> {

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
			this.props.onChange({value: html})
		}
		this.lastHtml = html
	}

	render() {
		return (
			<P {...this.props.extraProps}>
				  <span
					  contentEditable
					  ref={this.contentEditable}
					  onInput={this.emitChange}
					  onBlur={this.emitChange}
				  />
			</P>
		)
	}
}