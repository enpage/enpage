<p align="center">
    <img alt="Enpage SDK" src="https://raw.githubusercontent.com/enpage/enpage/main/docs/public/enpage.svg" width="437">
</p>

# Enpage SDK

The Enpage SDK encompasses the  core functionality for the Enpage templates.
Based on standard web technologies (HTML, CSS, JS), it provides a set of components, utilities, and tools to assist you
in creating templates that are responsive, accessible, and easy to customize and use.

## Get your Enpage website

Visit [https://enpage.co](https://enpage.co) to try the Enpage Editor and create your own website for free.


## Develop templates for Enpage

Please visit the documentation at [https://developers.enpage.co](https://developers.enpage.co)

## Contributing

Visit https://developers.enpage.co/contribute.html for more information on how to contribute to the Enpage SDK.


### SDK Development

Run `pnpm dev` at the root of the monorepo and this will build and watch the SDK for changes.
If you want to test the SDK in the template example, you'll also need to run `pnpm dev` in the
`packages/template-example` directory.

### Releasing new versions

Run `pnpm changeset` to create a new changeset and push it to your pull request branch.

### Documentation Development

Run `pnpm docs:dev` at the root of the monorepo to start the documentation server.
Edit the markdown files in the `docs` directory to make changes to the documentation.

## License

This project is licensed under the AGPL License v3 - see the [LICENSE](./LICENSE) file for details.

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
