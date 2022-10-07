# Local Colors Art Gallery layout manager

Hey there! Thanks for taking a look at this!

### Philosophies:

1. **Web app**. You only need a web browser to view the preview or use the editor. No compiling or installations necessary, and no app downloads required. Everyone already has a web browser!
2. **Super compatible**. ES5 (ish), Vue 2, and the corresponding Vuex 3 and Vue Router 3.
	1. As cross browser as possible. Testing on Chrome, Safari, and Firefox, mobile and desktop.
	2. iOS as far back as iOS ~~9.1~~ 10 has been accommodated.
		- iOS 9.1 should work but doesn't; investigating
		- iOS 10+ is required for the "copy link" button to work (which requires `document.execCommand("copy")`), but for browsers that don't support this feature, the text can be selected by hand and copied manually.
3. **No server-side data management**. No authentication, and no external server to manage; all the data is kept in the URL query itself. Save the link, and you've saved the map!
4. **Beginner friendly**. If you can read and click buttons, you have all the skills you need to use the editor.
	1. Buttons do what they say they do, confirmation dialogs keep users from committing changes by accident, warnings are given for problems in the page itself (as opposed to the console), and hovertext explains buttons and text fields in greater detail.
	2. Cache busting is used when preview behavior changes, so no need to ask anyone to clear their cache or try a hard refresh to see updated content.

### Advanced Management

1. This repo is currently hosted for free at Github. However, historical links rely on this specific URL `https://marycjenkinsart.github.io/local-colors-slot-manager/`. If something about this host setup changes, users will need to be instructed to change the domain for old links.
2. New wall flow templates can be added with Illustrator or other vector graphics softwate and the `upstairs2.svg` and `downstairs2.svg` SVGs.
	1. Each map template is a single SVG group. Name this group what you want the template to be labeled in the editor.
		1. NOTE: the URL encodes the template name, so don't change the name once you've used it.
	2. The first template is considered by the app to be the default, and is the fallback value when one is not given. (First in Illustrator is the bottom; first in the SVG itself is the top!)
	3. Line segments are interpreted in order (again, this will be backwards in Illustrator). The first vertex and the last vertex are interpreted clockwise unless the group name contains the string `ccw`.
	4. No styles from these lines are considered, nor labels. Only the vertices themselves are used to determine edge flow.
	5. Once the lines are done, save the SVG and copy all the template groups from that floor into `rawTemplates` inside `templates.js`, depending on which floor it is.
	6. The web app will now see the new templates. However, if you use one of the new ones, you should increment the URL infix of `compactURL` within `free-range-functions.js` to ensure other users will, too. (Cache busting)
	7. NOTE: the SVG coordinate space is hard coded several places. If you change the display map coordinates or the appearance or viewbox size of the SVG, you will have to make other adjustments a number of places.

### For the Future

- How to make the colors more colorblind friendly?
- 1/2 base slot size is an assumption that is made multiple places. Given that the URL router stores the slot sizes in integers (why did decimals break again?), is there an elegant way of abstracting this a little bit?
	- The version flag (in the `x` router query) will need to be used to determine which slot paradigm it is.
- The "legacy mode" SVGs are enormous and ugly in the Vue template. Given that they're not used hardly at all (yet still cannot be removed to maintain backwards compatibility) how best might they be sent elsewhere?
- Do I actually want external data persistence after all?? (Eep)
