import styled from 'styled-components';
import React from 'react'
const S = styled.section`

	border: cyan 1px dotted;
	min-height: 20px;

`

export default class Section extends React.Component<any> {
	static type = 'Section'
	render() {
		return <S>
			<div className="container">
				{this.props.children}
			</div>
		</S>
	}

}