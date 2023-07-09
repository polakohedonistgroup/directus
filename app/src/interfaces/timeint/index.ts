import { defineInterface } from '@directus/utils';
import PreviewSVG from '../datetime/preview.svg?raw';
import InterfaceTimeInt from './timeint.vue';

export default defineInterface({
	id: 'timeint',
	name: 'Time (int)',
	description: 'Enter time and store as integer',
	icon: 'today',
	component: InterfaceTimeInt,
	types: ['integer'],
	group: 'selection',
	options: null,
	recommendedDisplays: ['datetime'],
	preview: PreviewSVG,
});
