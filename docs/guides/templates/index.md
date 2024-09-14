---
title: "Writing a template: Overview"
---

# Enpage Templates Overview

Templates are the foundation of websites created on the Enpage platform. They are pre-designed layouts that enable users to build a website without any coding.


<div class="grid md:grid-cols-2 gap-x-8 gap-y-2">
  <div>
    <h2>Open technologies</h2>
    <p class="text-pretty">
      Templates are created using HTML, CSS, and JavaScript, and can include various assets. They define the layout and design of a website, customizable to suit the site owner's needs. Enpage bundler, based on Vite, allows the use of modern JavaScript features and direct import of CSS and other assets in JavaScript files.
    </p>
  </div>
  <div>
    <h2>No framework enforced</h2>
    <p class="text-pretty">
      Templates are not tied to specific frameworks or libraries like React or Vue, giving developers and designers freedom to use preferred tools. Tailwind CSS is recommended for styling and bundled by default, but it can be easily disabled if not needed. This flexibility allows for diverse development approaches.
    </p>
  </div>
  <div>
    <h2>Dynamic templates</h2>
    <p class="text-pretty">
      A unique feature of Enpage as a website builder is its ability to use multiple data sources to populate templates. This enables the templates to be dynamic, displaying different content based on various data inputs. This flexibility allows for creating rich, data-driven websites that can adapt to changing information sources.
    </p>
  </div>
  <div>
    <h2>SEO friendly</h2>
    <p class="text-pretty">
      Enpage templates are designed to be SEO-friendly, optimized for search engines to improve website visibility in search results. Even with dynamic data sources, Enpage ensures optimization by rendering templates server-side. During development or within the Enpage Editor, templates are partially rendered client-side to facilitate live editing and previewing.
    </p>
  </div>
</div>



## Accessibility

Accessibility is of course a priority, and Enpage templates should be designed to be accessible to all users, including those with disabilities. The Enpage SDK provides tools to help developers ensure their websites are accessible, such as color contrast checking and ARIA attributes management.
