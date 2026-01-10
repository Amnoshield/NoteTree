import template from './node-template.html?raw';

const canvas = document.getElementById("canvas")

class TreeNode {

	constructor();
	constructor(text : string);
	constructor(text? : string) {
		if (text == undefined) {
			text = "";
		}
		this.content = template.replace('{{ text }}', text);
		canvas?.insertAdjacentHTML("beforeend", this.content);
	}

	private content : string;
}

new TreeNode("1");
new TreeNode("2");
new TreeNode("3");