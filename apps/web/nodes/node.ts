import template from './node-template.html?raw';
import type { SaveSystem } from '../SaveSystem';

class TreeNode implements SaveSystem {

	public save(): JSON {
		return JSON.parse('{\
			"name":"test"\
		}');
	}
	public load(data: JSON): void {
		throw new Error('Method not implemented.');
	}

	public addParent(parent: TreeNode) {
		this.parent = parent;
		throw new Error('Method not implemented.');
	}

	public removeParent(parent: TreeNode) {
		throw new Error('Method not implemented.');
	}

	public addChild(child: TreeNode) {
		this.childArea.insertBefore(child.getWrapper(), null);
		this.children.push(child);
		child.addParent(this);
		throw new Error('Method not implemented.');
	}

	/**
	 * Remove the given child from the this parent. If child is not a child of this TreeNode it is ignored.
	 * @param child Child to remove
	 * @returns void
	 */
	public removeChild(child: TreeNode): void {
		if (!this.children.includes(child))
			return;
		child.removeParent(this);
		throw new Error('Method not implemented.');
	}

	private addToCanvas(canvas: HTMLElement) {
		canvas.insertAdjacentElement("beforeend", this.wrapper);
	}

	// lock and unlock text editing
	private dblClick = (e: MouseEvent) => {
		e.preventDefault();

		const caret = Number(this.textArea.dataset.caret ?? 0);

		this.textArea.readOnly = false;
		this.textArea.focus()
		this.textArea.setSelectionRange(caret, caret);
		this.textArea.classList.toggle("selection-disabled", false);

		this.textArea.addEventListener("focusout", this.lock)
		this.textArea.removeEventListener("dblclick", this.dblClick)
	}

	private lock = (e: FocusEvent) => {
		this.textArea.removeEventListener("focusout", this.lock)
		this.textArea.addEventListener("dblclick", this.dblClick)
		this.textArea.readOnly = true;
		this.textArea.blur()
		this.wrapper.focus()
		this.textArea.classList.toggle("selection-disabled", true);
	}

	private trackCaretPosition = (e: MouseEvent) => {
		// Store caret position before dblclick selection happens
		if (this.textArea.readOnly) {
			this.textArea.dataset.caret = String(this.textArea.selectionStart ?? 0);
		}
	}

	//draging
	private startDrag = (e: MouseEvent) => {
		if (document.activeElement === this.textArea)
			return;

		//e.preventDefault();
		// get the mouse cursor position at startup:
		this.Xmouse = e.clientX;
		this.Ymouse = e.clientY;
		//document.onmouseup = this.stopDrag;
		// call a function whenever the cursor moves:
		document.addEventListener("mouseup", this.stopDrag)
		document.addEventListener("mousemove", this.elementDrag)
	}

	private elementDrag = (e: MouseEvent) => {
		e.preventDefault();
		// calculate the new cursor position:
		var Xdif = this.Xmouse - e.clientX;
		var Ydif = this.Ymouse - e.clientY;
		this.Xmouse = e.clientX;
		this.Ymouse = e.clientY;
		// set the element's new position:
		this.Xpos -= Xdif;
		this.Ypos -= Ydif;
		this.setPos(this.Xpos, this.Ypos)
	}

	private stopDrag = (e: MouseEvent) => {
		//stop moving when mouse button is released:
		document.removeEventListener("mouseup", this.stopDrag)
		document.removeEventListener("mousemove", this.elementDrag)
		this.textArea.blur()
		this.wrapper.focus()
	}

	private setPos(x: number, y: number) {
		this.wrapper.style.left = x + "px";
		this.wrapper.style.top = y + "px";
	}

	//constructor
	constructor(canvas: HTMLElement, options?: { text?: string; pos?: { x: number; y: number } }) {
		this.parent = null;

		var text;
		var pos;
		if (options !== undefined) {
			text = options.text;
			pos = options.pos;
		}

		this.Xpos = 0;
		this.Ypos = 0;
		if (pos !== undefined) {
			this.Xpos = pos.x;
			this.Ypos = pos.y;
		}
		else {
			var Xscreen: number = window.innerWidth / 2;
			var Yscreen: number = window.innerHeight / 2;
			var Xcanvas: number = canvas.offsetLeft;
			var Ycanvas: number = canvas.offsetTop;
			this.Xpos = Xscreen - Xcanvas;
			this.Ypos = Yscreen - Ycanvas;
		}

		this.children = [];

		if (text == undefined)
			text = "";
		var content: string = template.replace('{{ text }}', text);

		this.Xmouse = 0;
		this.Ymouse = 0;

		this.wrapper = document.createElement('div');
		this.wrapper.setAttribute('class', 'tree-node');
		this.setPos(this.Xpos, this.Ypos);
		this.wrapper.innerHTML = content;
		this.wrapper.style.position = "absolute"
		this.wrapper.addEventListener("mousedown", this.startDrag)

		const textAreaCheck = this.wrapper.getElementsByTagName('textarea')[0];
		if (textAreaCheck !== undefined) // This should always pass
			this.textArea = textAreaCheck
		else
			throw new Error("Error: textarea element not found")
		const childAreaCheck = this.wrapper.getElementsByClassName("children")[0];
		if (childAreaCheck !== undefined)
			this.childArea = <HTMLElement>childAreaCheck;
		else
			throw new Error("Children class not found");

		this.textArea.addEventListener('dblclick', this.dblClick)
		this.textArea.addEventListener("mousedown", this.trackCaretPosition)
		this.textArea.classList.toggle("selection-disabled", true);

		this.addToCanvas(canvas);
	}

	public getWrapper() {
		return this.wrapper;
	}
	// fields
	private wrapper: HTMLElement;
	private textArea: HTMLTextAreaElement;
	private childArea: HTMLElement;
	private children: TreeNode[];
	private parent: TreeNode | null;
	private Xmouse: number;
	private Ymouse: number;
	private Xpos: number;
	private Ypos: number;
}


const canvas = document.getElementById("canvas")
if (canvas !== null) {
	var one = new TreeNode(canvas, { text: "1asdfasdfadsf", pos: { x: 50, y: 100 } });
	var two = new TreeNode(canvas, { text: "2" });
	var three = new TreeNode(canvas);
	one.addChild(two);
}