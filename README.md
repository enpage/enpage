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

### FAQ

<details>
<summary>Can I use the Enpage SDK in a proprietary website?</summary>

While the Enpage SDK is licensed under the GNU Affero General Public License (AGPL),
 users can still build proprietary websites using it. However, there are some key considerations:

1. The AGPL doesn't restrict the use of the library in proprietary websites.
2. If the website simply uses the library without modifying it, there's no obligation to release the website's source code.
3. However, if the website modifies the AGPL-licensed library, those modifications must be made available under the AGPL.
4. The AGPL has a "network use" clause: If the modified library is used to provide a service over a network (like a web application), the source code of the modified library must be made available to users of that service.
5. This doesn't mean the entire website code needs to be open-sourced, just the modifications to the AGPL-licensed library.
</details>
