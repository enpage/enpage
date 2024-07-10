# Navigation methods

::: tip About
Navigation methods only make sense when used in multi-page templates.
:::

## `enpage.nextPage()`

Navigates to the next page if available.

```html
<button onclick="enpage.nextPage()">Next</button>
```

## `enpage.previousPage()`

Navigates to the previous page if available.

```html
<button onclick="enpage.previousPage()">Previous</button>
```

## `enpage.goToPage(page: number)`

Navigates to a specific page. The page number is 0-based.

```html
<button onclick="enpage.goToPage(2)">Go to page 3</button>
```

## `enpage.firstPage()`

Navigates to the first page. This is equivalent to `enpage.goToPage(0)`.

```html
<button onclick="enpage.firstPage()">Go to first page</button>
```

## `enpage.lastPage()`

Navigates to the last page.
This is equivalent to `enpage.goToPage(enpage.totalPages - 1)`.

```html
<button onclick="enpage.lastPage()">Go to last page</button>
```

## `enpage.currentPage`

Returns the current page number (0-based).

```html
<p ep-bind>Current page: {{ enpage.currentPage }}</p>
```

## `enpage.totalPages`

Returns the total number of pages.

```html
<p ep-bind>Total pages: {{ enpage.totalPages }}</p>
```

## `enpage.canGoForward`

`true` if there is a next page available.

```html
<button ep-bind:disabled="{{ enpage.canGoForward == false }}" onclick="enpage.nextPage()">Next</button>
```

## `enpage.canGoBack`

`true` if there is a previous page available.

```html
<button ep-bind:disabled="{{ enpage.canGoBack == false }}" onclick="enpage.previousPage()">Previous</button>
```
