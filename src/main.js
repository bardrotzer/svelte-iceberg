import App from './App.svelte';
import Basic from './views/Basic.svelte';

const app = new Basic({
	target: document.body,
	// props: {
	// 	name: 'world'
	// }
});

export default app;