import { EPBlockBase } from "../base/ep-block-base";

class VideoBlock extends EPBlockBase {
  static get observedAttributes() {
    return ["src", "poster", "autoplay", "controls", "loop", "muted"];
  }

  get src() {
    return this.getAttribute("src") || "";
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  get poster() {
    return this.getAttribute("poster") || "";
  }

  set poster(value: string) {
    this.setAttribute("poster", value);
  }

  get autoplay() {
    return this.hasAttribute("autoplay");
  }

  set autoplay(value: boolean) {
    if (value) {
      this.setAttribute("autoplay", "");
    } else {
      this.removeAttribute("autoplay");
    }
  }

  get controls() {
    return this.hasAttribute("controls");
  }

  set controls(value: boolean) {
    if (value) {
      this.setAttribute("controls", "");
    } else {
      this.removeAttribute("controls");
    }
  }

  get loop() {
    return this.hasAttribute("loop");
  }

  set loop(value: boolean) {
    if (value) {
      this.setAttribute("loop", "");
    } else {
      this.removeAttribute("loop");
    }
  }

  get muted() {
    return this.hasAttribute("muted");
  }

  set muted(value: boolean) {
    if (value) {
      this.setAttribute("muted", "");
    } else {
      this.removeAttribute("muted");
    }
  }

  protected get contents() {
    return `
      <video
        src="${this.src}"
        ${this.poster ? `poster="${this.poster}"` : ""}
        ${this.autoplay ? "autoplay" : ""}
        ${this.controls ? "controls" : ""}
        ${this.loop ? "loop" : ""}
        ${this.muted ? "muted" : ""}
      ></video>
    `;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.blockType,
      src: this.src,
      poster: this.poster,
      autoplay: this.autoplay,
      controls: this.controls,
      loop: this.loop,
      muted: this.muted,
    };
  }
}

customElements.define("ep-video-block", VideoBlock);
