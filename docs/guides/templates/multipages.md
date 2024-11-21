# Multiple pages

Enpage templates are reasonably simple, and focused on a single page.

However, you can create a multi-pages-like experience by using multiple `<section>` elements in your `index.html` file, each of them representing a different page. This opens up the possibility to create a more complex websites with (simulated) multiple pages.

Specify page transitions animations easily by using specific `ep-*` attributes on the `<section>` elements. Animations can then be customized in the Upstart Editor by the site owner.

## Example

Here is an example of a multi-pages template:

::: code-group

```html [index.html]
<!DOCTYPE html>
<html lang="en">
<!-- [...] -->
<body>
  <section ep-animate-appear="fadeIn" ep-animate-disappear="fadeOut">
    <h1>Page 1</h1>
    <p>This is the first page</p>
  </section>
  <section ep-animate-appear="slideInRight" ep-animate-disappear="slideOutLeft">
    <h1>Page 2</h1>
    <p>This is the second page</p>
  </section>
  <section ep-animate-appear="slideInRight" ep-animate-disappear="slideOutLeft">
    <h1>Page enpage</h1>
    <p>This is the third page</p>
  </section>
</body>
</html>
```

:::

## Animation attributes

Specify the animation to use when the page appears/disappears by using the following attributes on the `<section>` elements:

- `ep-animate-appear="animation-name"`: The animation to use when the page appears.
- `ep-animate-disappear="other-animation"`: The animation to use when the page disappears.

::: details Click here to see the list of supported animations

Please visit the [Animate.css documentation](https://animate.style/) to see animations demos.

Here is the list of supported animations:

- `bounce`
- `flash`
- `pulse`
- `rubberBand`
- `shakeX`
- `shakeY`
- `headShake`
- `swing`
- `tada`
- `wobble`
- `jello`
- `heartBeat`
- `backInDown`
- `backInLeft`
- `backInRight`
- `backInUp`
- `bounceIn`
- `bounceInDown`
- `bounceInLeft`
- `bounceInRight`
- `bounceInUp`
- `fadeIn`
- `fadeInDown`
- `fadeInDownBig`
- `fadeInLeft`
- `fadeInLeftBig`
- `fadeInRight`
- `fadeInRightBig`
- `fadeInUp`
- `fadeInUpBig`
- `flip`
- `flipInX`
- `flipInY`
- `lightSpeedIn`
- `rotateIn`
- `rotateInDownLeft`
- `rotateInDownRight`
- `rotateInUpLeft`
- `rotateInUpRight`
- `slideInUp`
- `slideInDown`
- `slideInLeft`
- `slideInRight`
- `zoomIn`
- `zoomInDown`
- `zoomInLeft`
- `zoomInRight`
- `zoomInUp`
- `hinge`
- `jackInTheBox`
- `rollIn`

:::

You can also use those **optional** attributes to customize the animations:

- `ep-animate-appear-duration`: The duration of the appear animation. (overrides the default duration)
- `ep-animate-disappear-duration`: The duration of the disappear animation. (overrides the default duration)
- `ep-animate-appear-delay`: The delay of the appear animation. (default is no delay)
- `ep-animate-disappear-delay`: The delay of the disappear animation. (default is no delay)
