# Getting Started

This guide will help you get started with creating templates for Enpage.

## Prerequisites

Before you start creating templates for Enpage, you need to have the following:

- Basic knowledge of HTML, CSS, and JavaScript
- Node.js installed on your computer as well as a package manager like npm, pnpm or yarn.
- An account on Enpage (needed to submit your template)

## Create a new template

To create a new template, use the Enpage CLI. Run the following command in your terminal:

::: code-group

```bash [Using npm]
npm create enpage@latest my-template # Create in a new dir `my-template`
```

```bash [Using yarn]
yarn create enpage@latest my-template # Create in a new dir `my-template`
```

```bash [Using pnpm]
pnpm create enpage@latest my-template # Create in a new dir `my-template`
```

:::

Then, follow the instructions in the terminal to create your new template.
You can start building your template by editing the files in the `my-template` directory.

To preview your template, simply go to your template directory and run the `dev` command:

::: code-group

```bash [Using npm]
cd my-template
npm run dev
```

```bash [Using yarn]
cd my-template
yarn dev
```

```bash [Using pnpm]
cd my-template
pnpm dev
```

:::


This will start a local development server, allowing you to live edit and preview your template directly in your browser.

## Template structure

A template in Enpage is a collection of files and directories that define the layout and design of a website. Here is a basic structure of a template:

```plaintext
my-template/
  ├── assets/                 # Images, CSS, etc
  ├── enpage.config.js        # Enpage configuration file
  ├── index.html              # Main template file
  ├── src/                    # Javascript files
  └── tailwind.config.js      # Tailwind configuration file
```

By default, Enpage templates use [Tailwind CSS](https://tailwindcss.com) for styling. Customize the styles by editing the `tailwind.config.js` file. If you don't want to use Tailwind CSS, simply remove the `tailwind.config.js` and it will be automatically disabled.
