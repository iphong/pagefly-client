import styled from 'styled-components';
import React from 'react'
import {renderElement} from '../../shopify/App'

const S = styled.section`

	border: cyan 1px dotted;
	min-height: 20px;

`
export default class Section extends React.Component<any> {
	static type = 'Section'
	static inspector() {
		return <div>
			Section Inspector
			<input />
		</div>
	}
	render() {
		console.log(this.props.children)
		return <S>

			<div className="container">
				This is Section
				<div>
					{this.props.children}
				</div>
			</div>
		</S>
	}

}