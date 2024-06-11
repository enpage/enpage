# Enpage SDK

The Enpage SDK is a library that provides the core functionality for the Enpage templates.
It is developed using React, Vanilla Extract, and TypeScript.

## Create a new template

To create a new template, you can use the `create-enpage-template` CLI tool.
This tool will create a new template project with the Enpage SDK already installed.

To use the CLI tool, run the following command:

```bash
npm create enpage@latest my-template
cd my-template
npm start
```

This will create a new template project in the `my-template` directory and start the development server.

Once done, you can package the template using the `npm run build` command.

## Publish your template

To publish your template, you can use the `publish-enpage-template` CLI tool.
This tool will publish your template to the Enpage platform.

To use the CLI tool, run the following command:

```bash
npx publish-enpage-template
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

It's important to provide a template that is responsive and accessible. The SDK facilitates this by providing a set of components that are already styled and accessible, as well
as base styles and classes that can be used to style the template.

### Basic template samples

- [Typescript example](./example/template-typescript.tsx)
- [Javascript example](./example/template-javascript.js)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
