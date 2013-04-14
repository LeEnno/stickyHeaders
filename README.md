stickyHeaders
=============

jQuery Plugin for iOS-like Sticky Headers

Installation
------------

1. Include [jQuery](http://jquery.com/ "jQuery"), i.e. place `<script src="js/jquery.min.js"></script>` in your footer.
2. Include stickyHeaders JS file: `<script src="js/jquery.stickyHeaders.js"></script>`.
3. Include stickyHeaders CSS file: `<link rel="stylesheet" href="css/jquery.stickyHeaders.css" />`.

Usage
-----

If you have markup like this:

```html
<!-- header -->
<h1>Lorem ipsum dolor sit amet.</h1>

<div class="sticky-header-wrap">

	<h2 class="sticky-header">Eine Überschrift</h2>
	<!-- ... -->
	
	<h2 class="sticky-header">Noch eine Überschrift</h2>
	<!-- ... -->

	<!-- more headings and content -->

</div>

<!-- footer -->
<footer>Lorem ipsum dolor sit amet.</footer>
```

initialize the plugin as follows:

```javascript
$('.sticky-header-wrap').stickyHeaders();
```

You'll have to add some CSS rules for the sticky header element to fit the style of the other headers. Refer to the tips at the bottom of this document for a few valuable tips.

LINK BELOW

Options
-------

Here is a list of possible options with the corresponding default values.

```javascript
var options = {
    headlineSelector:      '.sticky-header',
    hiddenClass:           'sticky-header-hidden',
    stickyElement:         'h2',
    stickyClass:           'sticky-helper',
    stickyChildren:        '<span></span>',
    textContainerSelector: 'span',
    endOfScrollPos:        null
}
```

### headlineSelector

The selector for the actual headlines.

- Default: `.sticky-header`

### hiddenClass

The class to be used for hidden headlines.

- Default: `sticky-header-hidden`

### stickyElement

The HTML tag of the sticky element.

- Default: `h2`

### stickyClass

The CSS class that will be applied to the sticky element.

- Default: `sticky-helper`

### stickyChildren

The HTML markup that will be placed inside the `stickyElement`. Will be used for inserting text. If you need more nested elements for your styling, this is the right place to go.

- Default: `<span></span>`
- Example: `<span class="outer"><span class="inner"></span></span>`

### textContainerSelector

The selector to find inside the `stickyElement` where the text will be placed. Change this in conjunction to `stickyChildren`.

- Default: `span`
- Example: `.inner` (see `stickyChildren`s example)

### endOfScrollPos

The position to end the scrolling at. You can give a numeric value as well as a function. The latter is recommended since it's more dynamic.

- Default: `null`
- Example: `function() { return $('footer').offset().top; }`

Misc
----

If you run into issues where the Plugin will assume the wrong header positions, try rebuilding the header cache by triggering the corresponding event:

```javascript
$(window).trigger('stickyHeadersRebuildCache');
```

You may need to do this as soon as the height of your content changes.

Tips for CSS
------------

- The simplest way to ensure same styling for headers and sticky element is to make sure the sticky element has the same class applied as the normal headers. But don't forget to add a unique class like `sticky-helper`.<br />You can add those classes via `stickyClass` option.
- Use nested elements in case the current markup isn't enough for your purposes. Refer to the `stickyChildren` and `textContainerSelector` options.
- Make the wrapper have `position:relative`. By saying "the wrapper" I mean the element the Plugin is called on. So when using `$('.sticky-header-wrap').stickyHeaders();` apply relative positioning to `.sticky-header-wrap`.
- If you change the default class names make sure to include the default stylings. Refer to the `jquery.stickyHeaders.css` file.
- If you have problems, check the demos from the next chapter.

Demo
----

LINK DEMOS