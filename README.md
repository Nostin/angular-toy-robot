# Toy Robot Coding Challenge developed in Angular

Toy Robot is a pretty popular coding challenge companies use for job vetting around the Melbourne IT scene I've seen it used quite a bit.

This is my take on it. The original spec for the challenge is in the PROBLEM.md document in the root of this repo. It says an interface isn't required but being an interface dev I've chosen to implement one anyway as well as extend it a little with a header and a command history etc..

Stack:

- Angular 9
- TypeScript
- NGRX
- Jasmine
- Prettier
- TS Lint
- immutabilty-helper

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

You will need the CLI to run the `ng` commands to serve, test and lint the project:

```
npm install -g @angular/cli
```

I built this in August 2020 using version 10.0.5 of the CLI.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Linting

Run `ng lint` to execute the unit tests via TS Lint. This is deprecated now, but it was bundled with the CLI version 10.0.5 so I used it along with the other bundled deps i.e. Jasmine.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running end-to-end tests

None implemented

## Muh thoughts

These are just some thoughts I had while acquainting myself with Angular. Perhaps Emma can help enlighten my opinions somewhat.

It’s using jasmine and the latest CLI bundles with tslint which is a deprecated library. I’d have preferred Jest tbh. It also bundles with karma for end to end testing. While this is nice, I probably won’t use e2e so it’s kind of just noise. If I did want it I’d use cypress. Therefore my first impressions are that I will need to do quite a bit of tinkering with the configuration to get a setup I’d be more comfortable with.

Looks like there’s a effload of plumbing code all up in here. No way to invoke a leaner new project although it looks like once you're done you can build with the --prod --aot flag to remove all the deps you didn't use or don't need.

Nice that there’s a terminal command to create a new component, as this plumbs it in the _way_ you should do it and saves you some time

Doesn’t bundle prettier. Had to install it. Also had to install tslint-config-prettier to get it to work since that’s how they’ve chosen to lint their shyert, also then had to strip the tslint config of the rules conflicting with the prettier ones. Bit of a faff but fairly straight forward.

In the cli generated project there’s an app.component.css which is an empty file.. the css is all in the app.component.html file. Why? I'd prefer if the example was built in the way you're supposed to build your app.

So it looks like app.component.ts is the root and that is where you start rendering other components you write. But, the bootstrapped app doesn’t give you and example of this and I’m googling around looking for this fundamental example and can’t find it. Frustrating.

Can’t self-close component elements like it React JSX. Why not?

Doesn’t bundle any state management. Had to learn and install NGRX but this is the same as react. There are other options available too if this seems heavy but my initial impression is that it’s actually a lot lighter than redux so it doesn’t really feel heavy to me.

Googling around you get the impression that NGRX is a bit to set up and heavy but implementing the store for the table top and command history, for me at least, was quick and easy. It is however a huge pain to use the current state in the component (not the teplate). Surprised they didn't make this easier somehow. I had to loop over the observer variable and return the first property to get it. Maybe there's a better way but my googling didn't yield many leads.

The console errors in angular seem to be less meaningful than in other frameworks or helpful in pointing you to where your error is

Mocking the store for unit tests is a huge ballache. I decided I'd rather thest the actual store anyway so I'm just importing that into the module instead.

The unit testing documentation seem to have all testing the implementation details as examples rather than the output. This seems to permeate through the community too which I’m a bit surprised about.

Karma gives you a nice browser interface for tests and also randomises them for you which is pretty nice.
