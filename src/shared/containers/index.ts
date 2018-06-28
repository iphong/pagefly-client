import {Container} from 'unstated-x';


declare global {
	interface Window {
		SelectedContainer: any;
	}
}

export const SelectedContainer = new Container({
	selected: {container: Container}
})

window.SelectedContainer = SelectedContainer