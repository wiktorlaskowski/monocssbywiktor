document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('*'); // Select all elements

    // Step 1: Apply inline attribute-based styling
    elements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            const attrName = attr.name;
            const attrValue = attr.value;

            // Ignore MonoCSS-specific attributes
            if (attrName.startsWith("mncss-")) return;

            if (CSS.supports(attrName, attrValue)) {
                el.style[attrName] = attrValue; // Apply valid CSS properties
            }
        });
    });

    // Step 2: Handle mncss-group and mncss-use-group
    const groups = {};

    elements.forEach(el => {
        // Store styles for mncss-group
        if (el.hasAttribute("mncss-group")) {
            const groupName = el.getAttribute("mncss-group");
            groups[groupName] = getComputedStyle(el); // Store computed styles
        }
    });

    elements.forEach(el => {
        // Apply styles from mncss-use-group
        if (el.hasAttribute("mncss-use-group")) {
            const groupName = el.getAttribute("mncss-use-group");

            if (groups[groupName]) {
                Object.assign(el.style, extractStyles(groups[groupName]));
            }
        }
    });

    // Step 3: Dynamically load keyframes.mncss and handle mncss-keyframe
    const keyframeScript = document.createElement('script');
    keyframeScript.src = './keyframes.mncss'; // Path to the keyframes file
    keyframeScript.onload = function () {
        // Keyframes are loaded; now process animations
        const animatableElements = document.querySelectorAll('[mncss-keyframe]');
        animatableElements.forEach(el => {
            const keyframeName = el.getAttribute("mncss-keyframe");
            const duration = el.getAttribute("mncss-duration") || "1s";
            const timingFunction = el.getAttribute("mncss-timing") || "ease";
            const iteration = el.getAttribute("mncss-iteration") || "infinite";

            if (window.MonoCSSKeyframes && window.MonoCSSKeyframes[keyframeName]) {
                const styleSheet = getOrCreateStyleSheet(); // Ensure a stylesheet is available
                const keyframeRule = generateKeyframeCSS(keyframeName, window.MonoCSSKeyframes[keyframeName]);
                styleSheet.insertRule(keyframeRule, styleSheet.cssRules.length);

                el.style.animation = `${keyframeName} ${duration} ${timingFunction} ${iteration}`;
            }
        });
    };
    keyframeScript.onerror = function () {
        console.warn('Failed to load keyframes.mncss. Keyframe animations will not be available.');
    };
    document.head.appendChild(keyframeScript);

    // Helper function to extract applicable CSS properties
    function extractStyles(computedStyles) {
        const extracted = {};
        for (let i = 0; i < computedStyles.length; i++) {
            const prop = computedStyles[i];
            extracted[prop] = computedStyles.getPropertyValue(prop);
        }
        return extracted;
    }

    // Helper function to generate CSS keyframe rules
    function generateKeyframeCSS(name, keyframe) {
        let css = `@keyframes ${name} { `;
        for (let percentage in keyframe) {
            css += `${percentage} { `;
            for (let property in keyframe[percentage]) {
                css += `${property}: ${keyframe[percentage][property]}; `;
            }
            css += `} `;
        }
        css += `}`;
        return css;
    }

    // Helper function to get or create a style sheet
    function getOrCreateStyleSheet() {
        let styleSheet = document.styleSheets[0];
        if (!styleSheet) {
            const styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            styleSheet = styleEl.sheet;
        }
        return styleSheet;
    }
});
