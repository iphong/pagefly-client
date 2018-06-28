import React, {Component, ComponentType, createRef, FormEvent, ReactNode, ReactType, RefObject} from 'react';
import IFrame from 'components/IFrame';
import {Container, Provider, Subscribe} from 'unstated-x';
import {findDOMNode} from 'react-dom';
import {Paragraph, ParagraphTest} from 'elements/Paragraph';
import {SelectedContainer} from 'containers';
import {createElement, createElement1} from 'helpers/createElement';
import Inspector from 'inspectors';
import uuid from 'uuid'

window.uuid = uuid

class App extends Component {

	state: {frame: IFrame} = {
		frame: null
	}
	render() {
		const {frame} = this.state
		return (
			<Provider>
				<div className="App">
					<IFrame head={`
						<style data-pagefly-css="all"></style>
						<style data-pagefly-css="mobile"></style>
					`} onLoad={(frame: IFrame) => {
						this.setState({frame})
					}}>
						<h3>This is demo Element</h3>
						<div>
							<Paragraph1/>
							<Paragraph2/>
							{/*<Paragraph3/>*/}
						</div>
					</IFrame>

					<h3>This is demo control inspector:</h3>
					{frame && <Inspector frame={frame} />}

				</div>
			</Provider>
		);
	}
}

const Paragraph1 = createElement({})(Paragraph)
const Paragraph2 = createElement({})(Paragraph)
const Paragraph3 = createElement1({})(ParagraphTest)

export default App;
