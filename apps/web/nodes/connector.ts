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
	private orthogonalPath(startPoint:Point, endPoint:Point, radius:number = 8): string {
		const horizontalDistance = endPoint.x - startPoint.x;
		const verticalDistance = endPoint.y - startPoint.y;

		// Vertical direction must never be 0 or curves collapse
		const verticalDirection =
			verticalDistance === 0 ? 1 : Math.sign(verticalDistance);

		// Radius must fit within both horizontal and vertical space
		const effectiveRadius = Math.min(
			Math.abs(horizontalDistance) / 2,
			Math.abs(verticalDistance) / 2,
			radius
		);

		// If there's no room for bends, fall back to a straight line
		if (effectiveRadius < 1) {
			return `M ${startPoint.x} ${startPoint.y}
					L ${endPoint.x} ${endPoint.y}`;
		}

		// Shared horizontal spine for overlapping edges
		const spineX = startPoint.x + horizontalDistance / 2;

		return `
			M ${startPoint.x} ${startPoint.y}
			H ${spineX - 0}
			Q ${spineX} ${startPoint.y}
			${spineX} ${startPoint.y + verticalDirection * effectiveRadius}
			V ${endPoint.y - verticalDirection * effectiveRadius}
			Q ${spineX} ${endPoint.y}
			${spineX + effectiveRadius} ${endPoint.y}
			H ${endPoint.x}
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

		var pointX = element.offsetLeft+ element.offsetWidth/2// -offset.x;
		pointX += (element.offsetWidth/2) *relativeLocation.x;
		var pointY = element.offsetTop+ element.offsetHeight/2// -offset.y;
		pointY += (element.offsetHeight/2) *relativeLocation.y;

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

		this.updateSVG(this.svg, this.path);

	}

	private updateSVG(svg: SVGSVGElement, path:SVGPathElement) {
		const pathBbox = path.getBBox();
		svg.setAttribute("width", pathBbox.width + "px");
		svg.setAttribute("height", pathBbox.height+30 + "px");
		svg.setAttribute("viewBox", `${pathBbox.x} ${pathBbox.y} ${pathBbox.width} ${pathBbox.height+15}`);

		var yoffset = this.from.offsetTop+this.from.offsetHeight/2-8;
		const above = yoffset < this.to.offsetTop+this.to.offsetHeight/2;

		if (above)
			svg.style.top = yoffset+'px';
		else
			svg.style.top = yoffset-pathBbox.height+'px';
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