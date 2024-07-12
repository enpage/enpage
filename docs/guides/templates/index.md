---
title: "Writing a template: Overview"
---

# Enpage Templates Overview

Templates are the foundation of websites created on the Enpage platform. They are pre-designed layouts that enable users to build a website without any coding.

## Open technologies

Templates are created using HTML, CSS, and JavaScript and can include images, fonts, and other assets. They define the layout and design of a website and can be customized to suit the needs of the site owner.
Enpage bundler is based on Vite, so you can use modern JavaScript features and import CSS and other assets directly in your JavaScript files.

## No specific framework enforced

Templates are not tied to a specific framework or library like React or Vue, giving developers and designers the freedom to use any tools they prefer. Tailwind CSS is recommended for styling and bundled by default, but it can be easily disabled if you prefer not to use it.

## Dynamic templates

One of the unique features of Enpage as a website builder is its ability to use multiple data sources to populate templates. This enables the templates to be dynamic, displaying different content based on various data sources.

## SEO friendly

Enpage templates are designed to be SEO-friendly, meaning they are optimized for search engines to improve a website's visibility in search results. Even with dynamic data sources, Enpage ensures this optimization by rendering the templates on the server side in production. During template development, or within the Enpage Editor, the templates are partially rendered client-side to facilitate live editing and previewing.

## Accessibility

Accessibility is also a priority, and Enpage templates should be designed to be accessible to all users, including those with disabilities. The Enpage SDK provides tools to help developers ensure their websites are accessible, such as color contrast checking and ARIA attributes management.
