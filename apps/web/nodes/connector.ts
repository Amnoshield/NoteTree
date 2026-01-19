interface Point {
	x: number;
	y: number;
}

export class Connector {

	/**
	 * Generate orthogonal path.
	 * @param p1 First point
	 * @param p2 Second point
	 * @param radius Radius of turns
	 * @returns Path
	 */
	private orthogonalPath(p1:Point, p2:Point, radius:number = 8): string {
		const midX = (p1.x + p2.x) / 2;
		return `
			M ${p1.x} ${p1.y}
			H ${midX - radius}
			Q ${midX} ${p1.y} ${midX} ${p1.y + Math.sign(p2.y - p1.y) * radius}
			V ${p2.y - Math.sign(p2.y - p1.y) * radius}
			Q ${midX} ${p2.y} ${midX + radius} ${p2.y}
			H ${p2.x}
		`;
	}

	/**
	 * Get the center point of the given element
	 * @param element Element to get the center point of.
	 * @param relativeLocation Location of point relative on the element. -1 is top/left, 1 is bottom/right, 0 is the center. (doesn't have to be an int)
	 * @returns The center point
	 */
	private getPoint(element: HTMLElement, relativeLocation: Point): Point {
		if (Math.abs(relativeLocation.x) > 1 || Math.abs(relativeLocation.y) > 1)
			throw new Error("Invalid input, point x & y must be between -1 and 1 (inclusive), was: ("+ relativeLocation.x +" , "+ relativeLocation.y +")")

		const bounds = element.getBoundingClientRect();

		const offset = this.getSvgOffset();

		var pointX = bounds.left+ bounds.width/2 -offset.x;
		pointX += (bounds.width/2) *relativeLocation.x;
		var pointY = bounds.top+ bounds.height/2 -offset.y;
		pointY += (bounds.height/2) *relativeLocation.y;

		return {
			x: pointX,
			y: pointY
		};

	}

	/**
	 * Get the offset of this svg
	 * @returns Offset
	 */
	private getSvgOffset(): Point {
		const r = this.svg.getBoundingClientRect();
		return {
			x: r.left,
			y: r.top,
		};
	}

	/**
	 * Add this connecter to the given HTML parent
	 * @param parent HTML parent
	 */
	private addParent(parent: HTMLElement) {
		parent.appendChild(this.svg);
	}

	/**
	 * remove this connecter from the parent node
	 */
	public removeParent() {
		this.svg.remove();
	}

	/**
	 * update the svg of this connecter
	 */
	public update() {
		this.path.remove()
		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.path.setAttribute('fill', 'none');
		this.path.setAttribute('stroke', '#aaa');
		this.path.setAttribute('stroke-width', '2');
		this.path.setAttribute('marker-end', 'url(#arrow)');
		this.path.setAttribute(
			'd',
			this.orthogonalPath(this.getPoint(this.from, {x:1, y:0}), this.getPoint(this.to, {x:-1, y:0}))
		);
		this.svg.appendChild(this.path);
	}

	constructor(from: HTMLElement, to: HTMLElement, parent: HTMLElement) {
		this.from = from;
		this.to = to;

		this.svg = <SVGSVGElement> document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.style.position = 'absolute';
		this.svg.innerHTML = `
			<defs>
				<marker id="arrow" viewBox="0 0 10 10"
				refX="10" refY="5"
				markerWidth="6" markerHeight="6"
				orient="auto">
				<path d="M 0 0 L 10 5 L 0 10 z" fill="#aaa"/>
				</marker>
			</defs>
		`;

		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.update();

		this.addParent(parent);
	}

	private from: HTMLElement;
	private to: HTMLElement;
	private svg: SVGSVGElement;
	private path: SVGPathElement;
}