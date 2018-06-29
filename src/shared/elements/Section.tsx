import styled from 'styled-components';
import React from 'react'
import {renderElement} from '../../shopify/App'

const S = styled.section`

	border: cyan 1px dotted;
	min-height: 20px;

`
export default class Section extends React.Component<any> {
	static type = 'Section'
	render() {
		console.log(this.props.children)
		return <S>

			<div className="container">
				{React.Children.map(this.props.children, renderElement)}
			</div>
		</S>
	}

}