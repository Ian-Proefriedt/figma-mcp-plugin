# Property Block Template

Fill out this template in plain English, then ask the assistant to create the JavaScript for your PropertyRegistry.

```
Property Name: [What the property is called in code, like "opacity" or "padding"]

Display Label: [What users will see in the UI, like "Opacity" or "Padding"]

Section: [Where to show it - choose from: layout, position-size, style, text]

Priority: [Display order - lower numbers appear first in the section]

Property Type: [Choose one]
- dropdown (for selecting from options)
- number (for numeric values)
- text (for text or complex values like colors)

If it's a dropdown:
- Options: [List the options users can select from]

If it's a number:
- Minimum value: [The smallest allowed value]
- Maximum value: [The largest allowed value]
- Step size: [How much it increases/decreases by]
- Unit: [Optional - like px, %, etc.]

How to get the value:
- [Describe where in the Figma node data this property is located]
- [Example: "Get the opacity from data.visual.opacity, or use 1 if not found"]

How to display the value:
- [Describe any special handling needed when showing the value]
- [Example: "Show as percentage" or "Format as hex color code"]
```

## Example

```
Property Name: opacity

Display Label: Opacity

Section: style

Priority: 25

Property Type: number

Minimum value: 0
Maximum value: 100
Step size: 1
Unit: %

How to get the value:
- Get the opacity from data.visual.opacity or use 1 if not found
- Convert from 0-1 range to 0-100 percentage

How to display the value:
- Show the number followed by % sign
``` 