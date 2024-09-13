# Navigation methods and attributes

::: tip About
Navigation methods or attributes shall only be used in the context of multi-pages templates.
:::

## `ep-next-page / enpage.nextPage()`

Navigates to the next page if available.

```html
<!-- Using the attribute (preferred way) -->
<button ep-next-page>Next</button>

<!-- Hide the element if there is no next page -->
<button ep-next-page="auto-hide">Next</button>

<!-- Or disable it -->
<button ep-next-page="auto-disable">Next</button>

<!-- Using the method -->
<button onclick="enpage.nextPage()">Next</button>
```

## `ep-previous-page / enpage.previousPage()`

Navigates to the previous page if available.

```html
<!-- Using the attribute (preferred way) -->
<button ep-previous-page>Previous</button>

<!-- Hide the element if there is no previous page -->
<button ep-previous-page="auto-hide">Previous</button>

<!-- Or disable it -->
<button ep-previous-page="auto-disable">Previous</button>

<!-- Using the method -->
<button onclick="enpage.previousPage()">Previous</button>
```


## `ep-goto / enpage.goToPage(page: number)`

Navigates to a specific page. The page number is 0-based.

```html
<!-- Using the attribute (preferred way) -->
<button ep-goto="2">Go to page 3</button>

<!-- Hide the element if the page is the current one -->
<button ep-goto="2" ep-auto-hide>Go to page 3</button>

<!-- Or disable it -->
<button ep-goto="2" ep-auto-disable>Go to page 3</button>

<!-- Using the method -->
<button onclick="enpage.goToPage(2)">Go to page 3</button>
```

## `ep-first-page / enpage.firstPage()`

Navigates to the first page.

```html
<!-- Using the attribute (preferred way) -->
<button ep-first-page>Go to first page</button>

<!-- Hide the element if the page is the current one -->
<button ep-first-page="auto-hide">Go to first page</button>

<!-- Or disable it -->
<button ep-first-page="auto-disable">Go to first page</button>

<!-- Using the method -->
<button onclick="enpage.firstPage()">Go to first page</button>
```


## `ep-last-page / enpage.lastPage()`

Navigates to the last page.

```html
<!-- Using the attribute (preferred way) -->
<button ep-last-page>Go to last page</button>

<!-- Hide the element if the page is the current one -->
<button ep-last-page="auto-hide">Go to last page</button>

<!-- Or disable it -->
<button ep-last-page="auto-disable">Go to last page</button>

<!-- Using the method -->
<button onclick="enpage.lastPage()">Go to last page</button>
```

## `enpage.currentPage`

Returns the current page number (0-based).

```html
<p>Current page: <slot name="enpage.currentPage"></slot></p>
```

## `enpage.totalPages`

Returns the total number of pages.

```html
<p>Total pages: <slot name="enpage.totalPages"></slot></p>
```

## `enpage.canGoForward`

`true` if there is a next page available.


## `enpage.canGoBack`

`true` if there is a previous page available.

