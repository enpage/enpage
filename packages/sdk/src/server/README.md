# Flow

## Local Development

In dev, the express server is used alongside the vite dev server (in middleware mode) as well as
hattip handlers.


### Flow

- Request is receive by the express server
- Vite middleware handles the request
- If vite does not handle the request, the request is passed to the hattip handlers
