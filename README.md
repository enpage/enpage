<p align="center">
    <img alt="Enpage SDK" src="https://raw.githubusercontent.com/enpage/enpage/main/docs/public/enpage.svg" width="437">
</p>

# Enpage SDK

The Enpage SDK regroups the  core functionality for the Enpage templates.
It is based on standard web technologies (HTML, CSS, JS) and provides a set of components, utilities and tools
to help you create templates that are responsive, accessible and easy to use and customize.

## Develop templates for Enpage

Please visit the documentation at [https://developers.enpage.co](https://developers.enpage.co)



## Contributing

This monorepo uses changesets to manage versioning and releases.
`pnpm changeset` can be used to create a changeset for a package.
When a PR with a changeset is merged, the GitHub action will automatically create a PR for the release.
Maintainers can then merge the release PR to publish the new version.

### SDK Development

1. Run `pnpm dev` at the root of the monorepo.
2. In another terminal, run `pnpm start` in the `packages/template-example` directory.

### Documentation Development

Run `pnpm docs:dev` at the root of the monorepo to start the documentation server.


## License

This project is licensed under the AGPL License - see the [LICENSE](./LICENSE) file for details.
