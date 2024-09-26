// @vitest-environment happy-dom
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { ImageBlock } from "../ep-image";

describe("Component: ep-image", () => {
  let imageBlock: ImageBlock;

  beforeEach(() => {
    imageBlock = new ImageBlock();
    document.body.appendChild(imageBlock);
  });

  afterEach(() => {
    document.body.removeChild(imageBlock);
  });

  it("should have default src", () => {
    expect(imageBlock.src).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM84wMAAeoBGpsbXSsAAAAASUVORK5CYII=",
    );
  });

  it("should set and get src", () => {
    const testSrc = "https://example.com/image.jpg";
    imageBlock.src = testSrc;
    expect(imageBlock.src).toBe(testSrc);
    expect(imageBlock.getAttribute("src")).toBe(testSrc);
  });

  it("should set and get alt", () => {
    const testAlt = "Test alt text";
    imageBlock.alt = testAlt;
    expect(imageBlock.alt).toBe(testAlt);
    expect(imageBlock.getAttribute("alt")).toBe(testAlt);
  });

  it("should have default height and width", () => {
    expect(imageBlock.height).toBe("auto");
    expect(imageBlock.width).toBe("100%");
  });

  it("should set and get height", () => {
    imageBlock.height = "200px";
    expect(imageBlock.height).toBe("200px");
    expect(imageBlock.getAttribute("height")).toBe("200px");

    imageBlock.height = 300;
    expect(imageBlock.height).toBe("300");
    expect(imageBlock.getAttribute("height")).toBe("300");
  });

  it("should set and get width", () => {
    imageBlock.width = "50%";
    expect(imageBlock.width).toBe("50%");
    expect(imageBlock.getAttribute("width")).toBe("50%");

    imageBlock.width = 500;
    expect(imageBlock.width).toBe("500");
    expect(imageBlock.getAttribute("width")).toBe("500");
  });

  it("should render correctly", () => {
    const testSrc = "https://example.com/image.jpg";
    const testAlt = "Test alt text";
    imageBlock.src = testSrc;
    imageBlock.alt = testAlt;
    imageBlock.width = "200px";
    imageBlock.height = "150px";

    const renderedHTML = imageBlock.render();
    expect(renderedHTML).toContain(`<picture>`);
    expect(renderedHTML).toContain(`<img`);
    expect(renderedHTML).toContain(`src="${testSrc}"`);
    expect(renderedHTML).toContain(`alt="${testAlt}"`);
    expect(renderedHTML).toContain(`style="width: 200px; height: 150px;"`);
  });

  it("should update DOM when render is called", () => {
    const testSrc = "https://example.com/image.jpg";
    const testAlt = "Test alt text";
    imageBlock.src = testSrc;
    imageBlock.alt = testAlt;
    imageBlock.width = "200px";
    imageBlock.height = "150px";

    imageBlock.render();

    const pictureElement = imageBlock.querySelector("picture");
    expect(pictureElement).not.toBeNull();

    const imgElement = pictureElement?.querySelector("img");
    expect(imgElement).not.toBeNull();
    expect(imgElement?.src).toBe(testSrc);
    expect(imgElement?.alt).toBe(testAlt);
    expect(imgElement?.style.width).toBe("200px");
    expect(imgElement?.style.height).toBe("150px");
  });
});
