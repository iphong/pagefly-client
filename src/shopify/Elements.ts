import { Container } from 'unstated-x'
import { createElement } from './App'

function load(type: string) {
	return createElement(require('../shared/elements/' + type).default)
}

const elements: { [key: string]: any } =  {
	'Section': load('Section'),
	'Button': load('Button')
}

export default elements