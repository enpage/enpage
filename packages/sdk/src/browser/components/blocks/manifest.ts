export const allBlocks = {
  text: {
    title: "Text",
    description: "Display a paragraph of text.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>`,
    template: '<ep-text ep-label="Text" ep-text-editable="html" ep-editable>My text</ep-text>',
  },
  heading: {
    title: "Heading",
    description: "Dislay a heading, like a title or subtitle.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 6v12M16 6v12M8 12h8"></path>
  </svg>`,
    template: '<ep-heading ep-editable ep-text-editable="plain" ep-label="Heading">My heading</ep-heading>',
  },
  button: {
    title: "Button",
    description: "Display a button that can be clicked.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>`,
    template: "<button>Click me</button>",
  },
  image: {
    title: "Image",
    description: "Display an image.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>`,
    template: '<ep-image ep-editable ep-label="Image"></ep-image>',
  },
  video: {
    title: "Video",
    description: "Display a video.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>`,
    template: "<ep-video src='https://example.com/video.mp4'></ep-video>",
  },
};
