// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { HeadingBlock, register, defaults } from "../ep-heading";

function stripLineBreaks(str: string) {
  return str.replace(/[\n\r]/g, "");
}

describe("Component: ep-heading", () => {
  beforeAll(() => {
    // we need to manually register the element for the tests
    register();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should render in the DOM", () => {
    const element = document.createElement("ep-heading");
    document.body.appendChild(element);
    expect(document.body.contains(element)).toBe(true);
  });

  it("should respect the level attribute", () => {
    const element = document.createElement("ep-heading");
    element.setAttribute("level", "2");
    element.content = "Foo";
    document.body.appendChild(element);
    expect(element.querySelector("h2")).not.toBeNull();

    const html = element.render();
    expect(stripLineBreaks(html)).toBe("<h2>Foo</h2>");
  });

  it('should default to "h1" when level is not set', () => {
    const element = document.createElement("ep-heading");
    element.content = "I'm a title";
    document.body.appendChild(element);
    expect(element.querySelector("h1")).not.toBeNull();

    const html = element.render();
    expect(stripLineBreaks(html)).toBe("<h1>I'm a title</h1>");
  });

  it("should not accept invalid level values", () => {
    const element = document.createElement("ep-heading");
    element.setAttribute("level", "invalid");
    document.body.appendChild(element);
    expect(element.querySelector("h1")).not.toBeNull();
  });

  it("should have default content", () => {
    const element = document.createElement("ep-heading");
    document.body.appendChild(element);
    expect(element.content).toBe(defaults.props.content);
  });

  it("should update content when attribute is set", () => {
    const element = document.createElement("ep-heading");
    element.content = "New content";
    document.body.appendChild(element);
    expect(element.content).toBe("New content");
  });

  it("should be able to render independently of the DOM", () => {
    const element = new HeadingBlock();
    element.content = "I'm a title";
    const html = element.render();
    expect(stripLineBreaks(html)).toBe("<h1>I'm a title</h1>");
  });
});
