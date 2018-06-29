import React from 'react'
import {createElement} from '../helpers/createElement';
import styled from 'styled-components';
const B = styled.button``
class Button extends React.Component<{extraProps: object}> {

	static type = 'Button'
	render() {
		return (
			<B {...this.props.extraProps}>
				This is a draggable button
			</B>
		)
	}
}

export default createElement({})(Button)