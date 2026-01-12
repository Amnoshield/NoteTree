import template from './node-template.html?raw';
import type { SaveSystem } from '../SaveSystem';
import { Tree } from './Tree';

class TreeNode implements SaveSystem {
	/**
	 * Add this TreeNode to the canvas. Must not have parent.
	 */
	private addToCanvas(): void {
		if (this.parent == null)
			this.canvas.insertAdjacentElement("beforeend", this.wrapper);
	}

	/**
	 * Update all children with the width of the widest child
	 */
	public updateChildWidth(): void {
		if (this.parent !== null) {
			this.parent.updateChildWidth();
			return;
		}

		const widths: Tree = this.getWidthTree();

		var maxWidths: number[] = []
		var currentDepth = 0
		while (true) {
			const data = <number[] | undefined>widths.getDataAtDepth(currentDepth, "width");
			if (data == undefined)
				break;

			var widest: number = 0;
			data.forEach((width: number) => {
				if (width > widest)
					widest = width;
			});
			maxWidths.push(widest);
			currentDepth++;
		}

		const myWidth = maxWidths[0]
		if (myWidth !== undefined) //This is always true
			this.updateWidth(myWidth, maxWidths.slice(1))

	}

	/**
	 * Get a tree containing all widths of all child TreeNodes
	 * @returns The tree containing all widths of child TreeNodes
	 */
	public getWidthTree(): Tree {
		var myTree = new Tree();
		myTree.setData("width", this.getWidth());
		if (this.children.length == 0)
			return myTree;

		this.children.forEach((child: TreeNode) => {
			myTree.addChild(child.getWidthTree());
		});
		return myTree;
	}

	/**
	 * Update the width this TreeNode takes up before it's children.
	 * @param width New max width
	 */
	public updateWidth(width: number, children:number[]): void {
		this.textWrapper.style.width = width + "px";
		if (children.length !== 0) {
			const nextWidth = children[0]
			if (nextWidth !== undefined){
				this.children.forEach((node: TreeNode) => {
					node.updateWidth(nextWidth, children.slice(1));
				});
			}
		}
	}

	/**
	 * Check to see if the width updated to a new potential max (this could be bigger or smaller)
	 */
	private checkWidthUpdate = () => {
		//const couldBeMax = this.lastTextAreaWidth == this.textWrapper.offsetWidth
		const widthChanged = this.textArea.offsetWidth !== this.lastTextAreaWidth;
		if (!widthChanged)
			return;
		if (this.parent !== null)
			this.parent.updateChildWidth();
		else
			this.updateChildWidth();

		this.lastTextAreaWidth = this.textArea.offsetWidth;

	}

	/**
	 * Save data representing all of this TreeNode
	 * @returns Data representing all of this TreeNode
	 */
	public save(): JSON {
		return JSON.parse('{\
			"name":"test"\
		}');
		//JSON.stringify(this)
	}

	/**
	 * Load data into this TreeNode. Overwrites properties of this TreeNode.
	 * @param data Data to load
	 */
	public load(data: JSON): void {
		throw new Error('Method not implemented.');
	}

	/**
	 * Set parent TreeNode. Does NOT call addChild on parent.
	 * @param parent New parent
	 */
	public setParent(parent: TreeNode): void {
		this.parent = parent;
		this.wrapper.style.position = "initial";
	}

	/**
	 * Remove parent, does NOT call removeChild on parent
	 * @param parent Parent to remove
	 */
	public removeParent(parent: TreeNode): void {
		this.wrapper.style.position = "absolute";
		this.parent = null;
		this.addToCanvas();
	}

	/**
	 * Add a child to this tree. Calls addParent on child.
	 * @param child Child to add
	 */
	public addChild(child: TreeNode): void {
		this.childArea.insertBefore(child.getWrapper(), null);
		this.children.push(child);
		child.setParent(this);
		//this.updateChildWidth();
	}

	/**
	 * Remove the given child from the this parent. Calls removeParent on child. If child is not a child of this TreeNode it is ignored.
	 * @param child Child to remove
	 * @returns void, early exit if given child is not a child of this TreeNode
	 */
	public removeChild(child: TreeNode): void {
		if (!this.children.includes(child))
			return;
		child.removeParent(this);
		var i = this.children.indexOf(child);
		this.children.splice(i, 1);
		this.childArea.removeChild(child.getWrapper());
	}

	// lock and unlock text editing
	/**
	 * Unlock textArea on double click. Remove highlight and set caret position.
	 * @param e Mouse event
	 */
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

	/**
	 * Lock the textArea when it losses focus
	 * @param e Focus event
	 */
	private lock = (e: FocusEvent) => {
		this.textArea.removeEventListener("focusout", this.lock)
		this.textArea.addEventListener("dblclick", this.dblClick)
		this.textArea.readOnly = true;
		this.textArea.blur()
		this.wrapper.focus()
		this.textArea.classList.toggle("selection-disabled", true);
	}

	/**
	 * Track the caret's position in the text before second click and textArea activation.
	 * @param e Mouse event
	 */
	private trackCaretPosition = (e: MouseEvent) => {
		// Store caret position before dblclick selection happens
		if (this.textArea.readOnly) {
			this.textArea.dataset.caret = String(this.textArea.selectionStart ?? 0);
		}
	}

	//draging
	/**
	 * Start dragging this TreeNode. If the textArea for this node is active exit early.
	 * @param e Mouse event
	 * @returns void, early exit if the textArea for this node is active
	 */
	private startDrag = (e: MouseEvent) => {
		if (document.activeElement === this.textArea || this.parent !== null)
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

	/**
	 * Drag this TreeNode
	 * @param e Mouse event
	 */
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

	/**
	 * Stop dragging this TreeNode
	 * @param e Mouse event
	 */
	private stopDrag = (e: MouseEvent) => {
		//stop moving when mouse button is released:
		document.removeEventListener("mouseup", this.stopDrag)
		document.removeEventListener("mousemove", this.elementDrag)
		this.textArea.blur()
		this.wrapper.focus()
	}

	/**
	 * Move this TreeNode to the given position relative to the parent HTML element
	 * @param x new X position relative to the parent HTML element
	 * @param y new Y position relative to the parent HTML element
	 */
	private setPos(x: number, y: number) {
		this.wrapper.style.left = x + "px";
		this.wrapper.style.top = y + "px";
	}

	/**
	 * Create a TreeNode.
	 * @param canvas Canvas to create this node on.
	 * @param options Text and position for the TreeNode. Defaults to no text and the center of the screen respectively
	 */
	constructor(canvas: HTMLElement, options?: { text?: string; pos?: { x: number; y: number } }) {
		this.parent = null;
		this.canvas = canvas;

		var text;
		var pos;
		if (options !== undefined) {
			text = options.text;
			pos = options.pos;
		}
		if (text == undefined)
			text = "";

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


		var content: string = template.replace('{{ text }}', text);

		this.Xmouse = 0;
		this.Ymouse = 0;

		this.wrapper = document.createElement('div');
		this.wrapper.setAttribute('class', 'tree-node');
		this.setPos(this.Xpos, this.Ypos);
		this.wrapper.innerHTML = content;
		this.wrapper.style.position = "absolute"

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
		this.textArea.addEventListener("mousedown", this.startDrag)
		this.lastTextAreaWidth = this.textArea.offsetWidth;
		this.textArea.addEventListener("input", this.checkWidthUpdate)

		const textWrapperCheck = this.wrapper.getElementsByClassName("text-wrapper")[0];
		if (textWrapperCheck != undefined)
			this.textWrapper = <HTMLElement>textWrapperCheck;
		else throw new Error('text-wrapper class not found');

		this.addToCanvas();
	}

	/**
	 * Getter for the wrapper / root HTML element for this TreeNode
	 * @returns The wrapper / root HTML element for this TreeNode
	 */
	public getWrapper(): HTMLElement {
		return this.wrapper;
	}

	/**
	 * Getter for the width of this TreeNode
	 * @returns The width of this TreeNode
	 */
	public getWidth(): number {
		const extraWidth = 4
		return this.textArea.offsetWidth+extraWidth;
	}

	// fields
	private lastTextAreaWidth: number;
	private canvas: HTMLElement; // Root element
	private wrapper: HTMLElement; // wrapper / root HTML element for this TreeNode (Not this tree as a whole).
	private textWrapper: HTMLElement; // wrapper around the text area.
	private textArea: HTMLTextAreaElement; // HTML textarea element
	private childArea: HTMLElement; // HTML element that holds children
	private children: TreeNode[]; // Array of child nodes in tree.
	private parent: TreeNode | null; // Parent in tree. Null when no parent.
	private Xmouse: number; // X pos of mouse. Initialized at 0
	private Ymouse: number; // Y pos of mouse. Initialized at 0
	private Xpos: number; // X pos of TreeNode
	private Ypos: number; // Y pos of TreeNode
}


const canvas = document.getElementById("canvas")
if (canvas !== null) {
	var one = new TreeNode(canvas, { text: "1asdfasdfadsf", pos: { x: 50, y: 100 } });
	var two = new TreeNode(canvas, { text: "2" });
	var three = new TreeNode(canvas, { text: '3' });
	var blank = new TreeNode(canvas);
	var four = new TreeNode(canvas, { text: '4' });
	var five = new TreeNode(canvas, { text: '5' });
	one.addChild(two);
	one.addChild(three);
	three.addChild(blank);
	two.addChild(four);
	blank.addChild(five);
	//one.removeChild(three);
}