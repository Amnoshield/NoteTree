import template from './node-template.html?raw';

class TreeNode {

	constructor();
	constructor(text : string);
	constructor(text? : string) {
		this.Xmouse = 0;
		this.Ymouse = 0;

		if (text == undefined) {
			text = "";
		}
		var content : string = template.replace('{{ text }}', text);

		this.wrapper= document.createElement('div');
		this.wrapper.innerHTML = content;
		this.wrapper.style.position = "absolute"
		this.wrapper.addEventListener("mousedown", this.startDrag.bind(this))
		//this.wrapper.onmousedown = this.startDrag;
	}

	public addToCanvas(canvas : HTMLElement) {
		canvas.insertAdjacentElement("beforeend", this.wrapper);
	}

	public addChild() {
		throw new Error("Not implemented yet");
	}

	startDrag = (e: MouseEvent) => {
		e.preventDefault();
		// get the mouse cursor position at startup:
		this.Xmouse = e.clientX;
		this.Ymouse = e.clientY;
		document.onmouseup = this.stopDrag;
		// call a function whenever the cursor moves:
		//document.onmousemove = this.elementDrag;
		document.addEventListener("mouseup", this.stopDrag)
		document.addEventListener("mousemove", this.elementDrag)
		console.log("starting drag")

	}

	elementDrag = (e: MouseEvent) => {
		e.preventDefault();
		// calculate the new cursor position:
		var Xdif = this.Xmouse - e.clientX;
		var Ydif = this.Ymouse - e.clientY;
		this.Xmouse = e.clientX;
		this.Ymouse = e.clientY;
		// set the element's new position:
		this.wrapper.style.top = (this.wrapper.offsetTop - Ydif) + "px";
		this.wrapper.style.left = (this.wrapper.offsetLeft - Xdif) + "px";
	}

	stopDrag = (e: MouseEvent) => {
		//stop moving when mouse button is released:
		document.removeEventListener("mouseup", this.stopDrag)
		document.removeEventListener("mousemove", this.elementDrag)
	}

	private wrapper : HTMLDivElement;
	private Xmouse : number;
	private Ymouse : number;
}


const canvas = document.getElementById("canvas")
if (canvas !== null) {
	new TreeNode("1").addToCanvas(canvas);
	new TreeNode("2").addToCanvas(canvas);
}