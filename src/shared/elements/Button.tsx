import React from 'react'
import {createPFElement} from '../helpers/createElement';
import styled from 'styled-components';
const B = styled.button``
export default class Button extends React.Component<{}> {

	static type = 'Button'
	static inspector() {
		return <div>
			Button Inspector
			<input />
		</div>
	}
	render() {
		return (
			<B>
				This is a draggable button
			</B>
		)
	}
}