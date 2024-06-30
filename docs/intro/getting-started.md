# Getting Started

This guide will help you get started with creating templates for Enpage.


## Prerequisites

Before you start creating templates for Enpage, you need to have the following:
- Basic knowledge of HTML, CSS, and JavaScript
- Node.js installed on your computer as well as a package manager like npm, pnpm or yarn.
- An account on Enpage (will be need to submit your template)


## Create a new template

To create a new template, you can use the Enpage CLI. Run the following command in your terminal:

::: code-group

```bash [Using npm]
# Create a new template in a new directory called `my-template`
npm create enpage my-template
```

```bash [Using yarn]
# Create a new template in a new directory called `my-template`
yarn create enpage my-template
```

```bash [Using pnpm]
# Create a new template in a new directory called `my-template`
pnpm create enpage my-template
```

:::

Then, follow the instructions in the terminal to create your new template.
You can start building your template by editing the files in the `my-template` directory.

To preview your template, run the following command in your terminal:


```bash
cd my-template
npm run start
```

This will start a local development server where you can preview your template in the browser.


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

By default, Enpage templates use [Tailwind CSS](https://tailwindcss.com) for styling. You can customize the styles by editing the `tailwind.config.js` file. If you don't want to use Tailwind CSS, you can simply remove the `tailwind.config.js` and it will be automatically disabled.
