import React from 'react'
import {createPFElement} from '../helpers/createElement';
import styled from 'styled-components';
const B = styled.button``
export default class Button extends React.Component<{ value: string }> {
	static defaultProps = {
		value: 'Test Button'
	}
	static inspector() {
		return <div>
			Button Inspector
			<input />
		</div>
	}
	render() {
		return (
			<B className="btn-abc">
				{this.props.value}
			</B>
		)
	}
}