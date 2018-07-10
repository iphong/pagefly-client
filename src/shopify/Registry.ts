import { Container } from 'unstated-x'
import uuid from 'uuid'

export type ContainerState = {
	id?: string,
	type?: string,
	data?: {},
	children?: number[]
}
const registry: { [key: number]: Container<ContainerState> } = {
	0: new Container({
		id: uuid(),
		type: 'Section',
		data: {},
		children: [1]
	}),
	1: new Container({
		id: uuid(),
		type: 'Button',
		data: {},
		children: []
	})
}

export default registry