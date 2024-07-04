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
Run:

- `pnpm changeset`: Execute the Changeset CLI using npm. This lets you use npm run changeset to invoke the CLI instead of using npx.
- `pnpm version:packages`: Takes Changesets that have been made, updates versions and dependencies of packages, and writes changelogs. This command handles all file changes related to versions before publishing to npm.
- `pnpm publish:packages`: This publishes any unpublished packages to npm, and creates git tags.

Read https://brionmario.medium.com/changesets-is-a-game-changer-fe752af6a8cc for more information on changesets.



## License

This project is licensed under the AGPL License - see the [LICENSE](LICENSE) file for details.
