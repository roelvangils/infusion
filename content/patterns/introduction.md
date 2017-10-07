+++
title = "Introduction"
toc = true
+++

Albos  — an acronym for `aria-labelledby` On Steroids — is a (vanilla) JavaScript helper that makes it easier to associate an accessible name to page elements. Albos applies `aria-labelledby` attributes, but provides a more flexible and intuitive interface.

To learn more the accessible name computation, see (todo).

## When to use?

Please note that not all HTML elements can be given an accessible name using one of the ARIA labeling attributes. They generally won't work reliably across screeenreaders when applied to other elements.

- You can safely apply them to links, buttons and all other input types.
- All HTML 5 landmark elements (such as header, footer, main, nav, article, aside and section)
- Every other element that has a expliciet ARIA role associated to it, such as `dialog`, `slider`, `tooltip` etc.


- Regular `<img>` elements accept ARIA labels happily as well, and they take precedence over the `alt` attribute. Generally it's easier to just use an `alt` attribute though.

interactive elements like a (when the href attribute is present), audio and video (when the controls attribute is present), input (unless they are of type="hidden"), select, button, and textarea
elements that have a landmark role – either implicit (header, footer, main, nav, aside, section, and form) or explicitly set via the role attribute
elements that have an explicit widget role applied using the role attribute – there are 27 widget roles in ARIA 1.1, including dialog, slider, progressbar, tooltip, and table
iframe and img elements

## Key features

- Use any query selector in your HTML
- Intuitive approach for adding custom text to concatenate values
- Use the true / false value of any checkbox (even custom ones) as a label
- Fixes inconsistencies in VoicOver

## Example 1: Labeling regions

```html
<div role="main" data-labelledby="h1">
   <h1>Wild fires spread across the San Diego Hills</h1>
   Strong winds expand fires ignited by high temperatures ...
</div>
```

## Example 2: Labeling images

```html
<figure role="image" data-labelledby="this img" data-describedby="this figcaption" role="group">
  <img alt="The Sydney Opera House" src="opera.jpg" />
  <figcaption>We saw the opera Barber of Seville at this place</figcaption>
</figure>
```

## Example 3: Descriptions for input fields

```html
<fieldset id="notifications">
  <legend>Notification settings</legend>
  <span>Notify</span>
  <select name="days" data-describedby="#notifications span:eq[1], this, #notifications span:eq[1]">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="2">2</option>      
  </select>
  <span>days in advance</span>
</fieldset>
```

## Example 4

In this pattern, the label Username comes from the associated `<label>` element. To make sure the hint (tooltip) is also announced when a AT is filling out the form (e.g. when in Forms mode, or when navigating using the tab key), we have to associate the tooltip.

You can use the [adjacent sibling combinator (+)](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors) for this. It matches the second element in the selector if it immediately follows the first element, and both are children of the same parent element.

```html
<div>
  <label fpr="username">Username</label>
  <input type="text" id="username" data-describedby="this + [role=tooltip]" />
  <div role="tooltip">Your username is your email address</div>
</div>
```

## Example 5
<ul class="tasks">
  <li class="task">
    <label>
      <input type="checkbox" data-describedby="this:checked ? 'Task completed' : this:parent > .dueIn" />
      <span class="taskDescription">Buy milk</span>
    </label>
    <span class="dueIn">Due in 5 days</span>
  </li>
  <li class="task">
    <label>
      <input type="checkbox" data-describedby="this:checked ? 'Task completed' : this:parent > .dueIn" />
      <span class="taskDescription">Buy milk</span>
    </label>
    <span class="dueIn">Due in 3 days</span>
  </li>
  <li>
    (…)
  </i>
</ul>