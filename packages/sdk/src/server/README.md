# Flow

## Local Development

In dev, the express server is used alongside the vite dev server (in middleware mode).


### Flow

- Request is receive by the express server
- Vite middleware handles the request
- If vite does not handle the request, the request is passed to the hattip handlers



## Production rendering

- Request to https://johndoe.enpage.co
- Cloudflare worker receives the request
- A first server-handler is called (the page config handler)
    - Worker gets page config from:
        - Either KV cache
        - Or, if not found in cache, from the API
    - If no page config can be found, respond with a 404 error
- A 2nd handler is called for rendering
    - The enpage "state" containing the page context and various information needed for the navigation and 
      the js-api is computed and replaced in the final HTML.
    - The HTML response is sent to the client.