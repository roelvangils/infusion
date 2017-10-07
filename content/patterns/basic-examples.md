+++
title = "Basic examples"
tags = ["example tag", "another tag"]
toc = true
+++

```html
<section>
  <h1>Heading</h1>
  <p>Just some text</p>
  <a href="http://www.example.com/">More…</a>
</section>
```
{{% fileTree %}}
* Level 1 folder
    * Level 2 file
    * Level 2 folder
        * Level 3 file
        * Level 3 folder
            * Level 4 file
        * Level 3 folder
            * Level 4 file
            * Level 4 file
        * Level 3 file
    * Level 2 folder
        * Level 3 file
        * Level 3 file
        * Level 3 file
    * Level 2 file
* Level 1 file
{{% /fileTree %}}

{{<demo>}} 
  <section>
    <h1 id="roelieboelie">Great stuff</h1>
    <p>Just some text</p>
    <a href="http://www.example.com/" data-labelledby="#roelieboelie">More…</a>
  </section>
  <style>
  * {
    font-family: sans-serif;
  }
  </style>
  <script>
    console.log(demo);
    albosApply(demo);
  </script>
{{</demo>}}

 