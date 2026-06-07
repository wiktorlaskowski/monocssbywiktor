# MonoCSS
MonoCSS is a lightweight JavaScript library that allows you to style elements using only attributes.

# Important notice
MonoCSS is no longer getting updates and will be replaced. R.I.P MonoCSS 2025 - 2026

## Features
- Style elements using inline attributes  
- Group styles using `mncss-group` and `mncss-use-group`  
- Support for animations using `mncss-keyframe`  

## Installation
Install via npm:
```bash
npm install monocss
```

Or include it directly in your project:
```html
<script src="monocss.js"></script>
<script src="keyframes.mncss"></script>
```

## Usage
Example of styling with attributes:
```html
<div mncss-group="primary-style" background-color="blue" color="white">
    <h1>Group Style Example</h1>
</div>

<div mncss-use-group="primary-style">
    <p>This element inherits styles!</p>
</div>

<div mncss-keyframe="fadeIn" mncss-duration="2s">
    <h2>Fade In Animation</h2>
</div>
```
## License
MIT
