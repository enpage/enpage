![Enpage SDK](https://github.com/FlippableSoft/enpage-sdk/blob/main/enpage-sdk.svg?raw=true)

# Enpage SDK

The Enpage SDK regroups the  core functionality for the Enpage templates.
It is based on standard web technologies (HTML, CSS, JS) and provides a set of components, utilities and tools
to help you create templates that are responsive, accessible and easy to use and customize.

## Create a new template

### Using Stackblitz

Click on the following link to create a new template using Stackblitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/FlippableSoft/enpage-sdk?configPath=packages/template-example)


### Locally

Creating a new template locally is really easy. Just run the following command:

```bash
npm create enpage@latest my-template
cd my-template
npm start
```

This will create a new template project in the directory `./my-template` and start the development server
so you can start working on your template right away and have a live preview in your browser.

Once done, you can package the template using the `npm run build` command.

## Publish your template

To publish your template, you run `npm release` command and follow the instructions.

```bash
npm run release
```

## Documentation

A template is composed of a set of standard exports:

- `<Template>`: The main component of the template.
- `metadata`: The metadata of the template.
- `datasources`: The datasources of the template.
- `sesttings`: The settings of the template.

The `metadata` export is an object with the following properties:

- `name`: The name of the template.
- `description`: The description of the template.
- `tags`: An array of tags for the template.
- `thumbnail`: The URL of the thumbnail image for the template.

The `datasources` export is a zod schema that defines the shape of the datasources for the template.

### Design notes

It's important to provide a template that is responsive and accessible.
The SDK facilitates this by providing a custom tailwind configuration and predefined classes that can be used to style the template.


## Contributing

This monorepo uses changesets to manage versioning and releases.
Run:

- `pnpm changeset`: Execute the Changeset CLI using npm. This lets you use npm run changeset to invoke the CLI instead of using npx.
- `pnpm version:packages`: Takes Changesets that have been made, updates versions and dependencies of packages, and writes changelogs. This command handles all file changes related to versions before publishing to npm.
- `pnpm publish:packages`: This publishes any unpublished packages to npm, and creates git tags.

Read https://brionmario.medium.com/changesets-is-a-game-changer-fe752af6a8cc for more information on changesets.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
