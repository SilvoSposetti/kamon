# Kamon

This is a browser start-page made with Angular 4, deployed [here](https://kamon-startpage.firebaseapp.com/) and developed as a single-page app.

It's main functional purpose is to replace browser bookmarks by combining keyboard shortcuts and search-engines' search into one app.

It's second purpose is to look cool. It thus contains some background scenes that use the HTML5 canvas in order to generate various animation.

This is a side project that I am doing just for fun, mostly because I like both getting to know and write algorithms that generate cool animations. As such it is only optimized for Chrome and Firefox, because those are the browsers I use.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## How to use

### Buttons

While the page is focused, you can write something at any time to trigger a search page and get search suggestions. Hit `Enter` to be redirected on a search engine's results page when what you tipped suits you. You can reset the search term by pressing `Esc`

Suggestions during typing are selectable, just use your `Arrow Keys` to select which one you are interested in. When a suggestion is selected, just hit `Enter` to search for that particular search key.

Other primary buttons are `PageUp` and `PageDown`, the first displays and hides the clock, while the second does the same for the list of shortcuts.


### Hovering
Hovering on the `top-left` will display a list of the selectable scenes and let you choose from one. Be careful because some are computationally intensive and might reduce a laptop battery faster than usual.

Hovering on the `bottom-right` will display information about the page. As well as a link to this GitHub repo.

## Future features

I am planning to add also a server that handles login credentials, so that anyone can easily create and save it's own shortcuts, default scenes and various settings preferences.

At the moment the page is not mobile-friendly, even though on mobile it won't be as usable as on a desktop, this would be a nice feature to have.

I am looking into adding interactive scenes, fancy term for saying that it would be cool to add games that also use the HTML5 canvas as display.

A to-do list is on it's way, something that can help keeping track of various personal tasks. This feature requires user profiles to be fully usable by anyone else but me, so don't expect it any time soon
.
## Getting Started

If you, want to fork, be my guest :)

### Prerequisites

Download the source code, then execute 

```
npm install
```
 
in the main project folderd. Then run 
```
ng serve
```
 for a locally run development server.
 
 Navigate to `http://localhost:4200/` (default port).
 
 The app will automatically reload if you change any of the source files.
 
 Interrupt the `ng serve` process to stop the development server.


## Deployment

I will now and then update the version of the app on Firebase as a demo for anyone interested.

## Contributing

As this is my personal project, I'm the only contributor.
If you would like to report a bug or have a functionality added, just hit me up with an issue.

## Versioning

There is no particular versioning at the moment.

## Authors

* **Silvo Sposetti** - Being the only one makes a bulleted list superfluous, even though it looks cool.

## License

This project is licensed under the MIT License.

## Acknowledgments

* Many of the scenes that I use for background are inspired by the [Coding Challenges](https://www.youtube.com/watch?v=17WoOqgXsRM&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH), a YouTube segment of the brilliant [Daniel Shiffman](http://shiffman.net/).
* I am using [joshforisha](https://github.com/joshforisha)'s [Open Simplex Noise](https://github.com/joshforisha/open-simplex-noise-js) implementation, so cudos to him ;)

