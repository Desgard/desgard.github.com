# Guardia Jekyll theme

### [Preview](http://desgard.com)

## Setup

### In the terminal run the commands

```
$ sudo npm i -g gulp bower browser-sync
$ sudo gem install bundler
$ bundle install
$ npm install
```

## Using Rake tasks

```
$ rake post title="TITLE OF THE POST"
$ rake page name="about.md"
$ rake category title="Programing"
$ rake tag title="Jekyll"
```

## Using Jekyll

### Running the server:

```
$ bundle exec jekyll server
```

Access, [localhost:4000](http://localhost:4000/)

## Using Gulp

### Rum gulp

```
$ gulp
```

---

## Deploy in Github pages in 2 steps

1. Change the variables `GITHUB_REPONAME` and `GITHUB_REPO_BRANCH` in `Rakefile`
2. Run `bundle exec rake` or `bundle exec rake publish` for build and publish on Github

### Copyright and license

The MIT License (MIT)

Copyright (c) 2015 Desgard_Duan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
