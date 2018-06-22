import './index.css';

export default async function run() {
	const React = (await import('react')).default;
	const ReactDOM = (await import('react-dom')).default;
	const App = (await import('App')).default;

	// import * as serviceWorker from './serviceWorker';

	ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// 	serviceWorker.unregister();



}