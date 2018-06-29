import React from 'react'
import {createPFElement} from '../helpers/createElement';
import styled from 'styled-components';
const B = styled.button``
class Button extends React.Component<{extraProps: object, minh: string}> {

	static type = 'Button'
	render() {
		return (
			<B {...this.props.extraProps}>
				This is a draggable button {this.props.minh}
			</B>
		)
	}
}

export default createPFElement({})(Button)