# Multiple pages

Enpage templates are resonibly simple, and focused on a single page.

However, you can create a multi-pages-like experience by using multiple `<section>` elements in your `index.html` file, each of them representing a different page. This opens up the possibility to create a more complex websites with (simulated) multiple pages.

You can specify page transitions animations easily by using specific data-attributes on the `<section>` elements. Animations can then be customized in the Enpage Editor by the site owner.

## Example

Here is an example of a multi-pages template:

::: code-group
```html [index.html]
<!DOCTYPE html>
<html lang="en">
<!-- [...] -->
<body>
  <section data-animation-appear="fadeIn" data-animation-disappear="fadeOut">
    <h1>Page 1</h1>
    <p>This is the first page</p>
  </section>
  <section data-animation-appear="slideInRight" data-animation-disappear="slideOutLeft">
    <h1>Page 2</h1>
    <p>This is the second page</p>
  </section>
  <section data-animation-appear="slideInRight" data-animation-disappear="slideOutLeft">
    <h1>Page 3</h1>
    <p>This is the third page</p>
  </section>
</body>
</html>
```
:::


## Animation attributes

Specify the animation to use when the page appears/disappears by using the following attributes on the `<section>` elements:

- `data-animation-appear="animation-name"`: The animation to use when the page appears.
- `data-animation-disappear="other-animation"`: The animation to use when the page disappears.


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
- `data-animation-appear-duration`: The duration of the appear animation. (overrides the default duration)
- `data-animation-disappear-duration`: The duration of the disappear animation. (overrides the default duration)
- `data-animation-appear-delay`: The delay of the appear animation. (default is no delay)
- `data-animation-disappear-delay`: The delay of the disappear animation. (default is no delay)



