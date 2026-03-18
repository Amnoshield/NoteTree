import { TreeNode } from './nodes/node';

export class Canvas {

    /**
     * Remove a node from the canvas
     * @param root_node Root node to remove
     */
    public removeRoot(root_node:TreeNode) {
        var index = this.tree_roots.indexOf(root_node)
		if (index == -1) return
		
        this.tree_roots.splice(index, 1);
        this.html.removeChild(root_node.getWrapper())
    }

    /**
     * Add a new root node to the canvas
     * @param root_node New root node
     */
    public newRoot(root_node:TreeNode) {
        if (!this.tree_roots.includes(root_node)) {
            this.tree_roots.push(root_node)
            this.html.appendChild(root_node.getWrapper())
        }
    }

    constructor() {
        this.html = <HTMLElement>document.getElementById("canvas")
        this.selected_node = null
        this.tree_roots = []
    }

    public getHTML() {return this.html}

    private html:HTMLElement
    private selected_node:TreeNode | null
    private tree_roots:TreeNode[]
}

export var canvas = new Canvas()


var one = new TreeNode({ text: "1asdfasdfadsf", pos: { x: 50, y: 100 } });
var two = new TreeNode({ text: "2" });
var three = new TreeNode({ text: '3' });
var blank = new TreeNode();
var four = new TreeNode({ text: '4' });
var five = new TreeNode({ text: '5' });
one.addChild(two);
one.addChild(three);
three.addChild(blank);
two.addChild(four);
blank.addChild(five);
for (var i=0; i<5; i++) {
    var child = new TreeNode();
    one.addChild(child);
}
one.removeChild(three);
