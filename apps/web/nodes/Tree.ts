export class Tree {
	/**
	 * Add a child
	 * @param child Child to add
	 */
	public addChild(child: Tree) {
		this.children.push(child)
	}

	/**
	 * Get data from a given depth of this tree. 0 is at this nodes level, 1 is the children of this node.
	 * @param depth Depth to get data from. 0 is at this nodes level, 1 is the children of this node.
	 * @returns The data from this node in an array if depth = 0, an array of data from the given depth, or undefined when no data exists or this node doesn't have nodes that reach the given depth.
	 */
	public getDataAtDepth<T>(depth: number, key:string): T[]| undefined {
		const myData = <T | undefined>this.getData(key);
		if (depth == 0){
			if (myData !== undefined)
				return [myData];
			return undefined;
		}

		if (this.children == undefined) {
			console.log("no children")
			return;
		}

		var data: T[] = []
		this.children.forEach((child: Tree) => {
			var childData: T[] | T | undefined = child.getDataAtDepth(depth-1, key);
			if ( childData !== undefined ) {
				childData.forEach((newData: T) => {
					data.push(newData);
				});
			}
		});
		if (data.length == 0)
			return;
		return data;
	}

	constructor(children? : Tree[]) {
		if (children == undefined)
			this.children = [];
		else
			this.children = children;
	}

	/**
	 * Set / add data to this tree node
	 * @param key Key own value
	 * @param value Value to store
	 */
	public setData<T>(key:string, value:T): void {
		this.data[key] = value;
	}

	/**
	 * Request custom data
	 * @param key Key to get data from
	 * @returns data
	 */
	public getData<T>(key:string): T | undefined {
		return this.data[key] as T | undefined;
	}
	/**
	 * Getter for children
	 * @returns Children
	 */
	public getChildren(): Tree[] {
		return this.children;
	}

	private data: Record<string, unknown> = {};
	private children: Array<Tree>; // children
}
