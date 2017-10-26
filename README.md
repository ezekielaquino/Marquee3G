# Marquee3G
There's Marquee3K, but this one's `3G`.
A Work in Progress™ but it's working.

There's a vanila/non-GSAP version: [Marquee3000](https://github.com/ezekielaquino/Marquee3000)

If you want to use it in its current state just do the following:

**A Marquee's HTML must be structured like:**
```html
<div class="marquee">
  <!-- You must have only a single container element, you can use any classname -->
  <div class="marquee-container">
    <!-- Whatever marquee contents you want -->
  </div>
</div>
```

**If you want to just initialise ALL `.marquee` or a custom selector:**

```js
import Marquee from '/path/to/Marquee3G';

// Note that you must define "gsap" to which one youre using
// either TimelineLite or TimelineMax
Marquee.init({
  selector: '.marquee', // default: .marquee
  gsap: TimelineLite // required! you must specify which GSAP you're using
});
```

**If you want more flexibility then you can also do your own init**

```js
import Marquee from '/path/to/Marquee3G';

const marquees = document.querySelectorAll('.marquee');

marquees.forEach(elem => {
  const marqueeName = elem.dataset.name;
  const marquee = new Marquee({
    element: elem, // required! the DOMElement
    gsap: TimelineLite, // required!
    name: marqueeName // optional: the name of the marquee
  });
});

console.log(Marquees);
```

**Marquee methods**
All marquee instances are stored within a `window.Marquees` labelled by its `index` or a `custom name` if you have specified it in an instance's options when initialised.

For example you have a Marquee named "footer-marquee" then you can just do the following methods when necessary:

```js
// Destroys the marquee and reverts back to original state
Marquees['footer-marquee'].destroy(); 

// Refreshes the marquee. For example, you change the font size/width of its contents
Marquees['footer-marquee'].refresh(); 
```

That's all for now