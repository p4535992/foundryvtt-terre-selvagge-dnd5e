/**
 *
 * ElementWrapper - ALTERED
 *
 * @version : 2.0.2
 * @author  : http://www.enea.sk
 *
 * @export
 * @class ElementWrapper
 * @extends {PIXI.DisplayObject}
 */
export class ElementWrapper extends PIXI.DisplayObject {
  /**
   * Creates an instance of ElementWrapper.
   *
   * @param {Element} [target=null]
   */
  constructor(target, parser, note) {
    super();

    // prevents AccessibilityManager crash
    this.children = [];
    this.style = {};
    this.note = note;
    this._parser = parser;

    this.target = target;
    target.style.position = "absolute";
    target.style.left = "0px";
    target.style.top = "0px";
    document.body.append(target);
    this._repositionHook = Hooks.on("canvasPan", () => this.updateTarget());

    this.prevID = -1;
    this._anchorX = 0;
    this._anchorY = 0;

    this.target.addEventListener("mouseover", () => {
      this.visible = true;
    });
    this.target.addEventListener("mouseleave", () => {
      this.visible = false;
    });
  }

  /**
   *
   * updateTarget
   *
   */
  updateTarget() {
    if (this.visible === false) return;
    const matrix = this.worldTransform;
    const bounds = this.bounds;
    this.toGlobal(new PIXI.Point(0, 0));
    const rightSide = matrix.tx < canvas.screenDimensions[0] / 2;
    const paddingX = (rightSide ? 1 : -1) * (bounds.width / 2 + 30);
    this.target.style.transform = `translate(${matrix.tx - bounds.width / 2 + paddingX}px, ${
      matrix.ty - bounds.height / 2
    }px)`;
  }

  /**
   *
   * render
   *
   */
  render() {
    if (this.prevID === this.transform._worldID || this.target === null) {
      return;
    }

    this.updateTarget();

    this.prevID = this.transform._worldID;
  }

  /**
   *
   * destroy
   *
   */
  destroy() {
    this.target.remove();
    Hooks.off("canvasPan", this._repositionHook);
    this.target = null;
    this.prevID = null;

    super.destroy();
  }

  /**
   *
   * bounds
   *
   * @readonly
   */
  get bounds() {
    return this.target.getBoundingClientRect();
  }

  /**
   *
   * anchorX
   *
   */
  get anchorX() {
    return this._anchorX;
  }

  /**
   *
   * anchorX
   *
   * @param {number} value
   */
  set anchorX(value) {
    this._anchorX = value;

    this.pivot.x = value * this.bounds.width;
  }

  /**
   *
   * anchorY
   *
   */
  get anchorY() {
    return this._anchorY;
  }

  /**
   *
   * anchorY
   *
   * @param {number} value
   */
  set anchorY(value) {
    this._anchorY = value;

    this.pivot.y = value * this.bounds.height;
  }

  /**
   *
   * anchorXY
   *
   * @param {number} value
   */
  set anchorXY(value) {
    this.anchorX = value;
    this.anchorY = value;
  }

  /**
   * visible
   *
   * @param {boolean} value
   */
  set visible(value) {
    if (!this.target || this.visible === value) return;
    this.target.style.opacity = value ? "1" : "0";
    if (value === false) {
      this._fadeoutTimeout = setTimeout(() => {
        this.target.style.display = "none";
      }, 150);
    } else {
      this.target.innerHTML = "";
      this.target.append(this._parser(this.note));

      this.target.style.display = "";
      clearTimeout(this._fadeoutTimeout);
    }
  }
  get visible() {
    if (!this.target) return false;
    return this.target.style.opacity !== "0";
  }
}

ElementWrapper.prototype.renderWebGL = ElementWrapper.prototype.render;
ElementWrapper.prototype.renderCanvas = ElementWrapper.prototype.render;
