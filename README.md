[![CircleCI](https://circleci.com/gh/ikoichi/node-package-finder/tree/master.svg?style=svg)](https://circleci.com/gh/ikoichi/node-package-finder/tree/master)

Find where a package is used in multiple folders.

When you have several projects is sometimes difficult to know where you are
using a specific package and which version. `package-finder` helps you solving
this issue

## Installation

```
npm install -g package-finder
```

## Usage

### CLI

```
Usage: package-finder --packages [packages] --folders [folders]

Options:
  --help          Show help                                            [boolean]
  --version       Show version                                         [boolean]
  -f, --folders   Comma separated list of folders to look into       [mandatory]
  -p, --packages  Comma separated list of package names              [mandatory]
```

#### Example

Multiple packages search

```
package-finder -f ./ -p "lodash:>=1.x,underscore:<2.0"
```

Find packages and dependecies with vulnerabilities (below a secure version)

```
package-finder -f ./ -p "lodash:<4.17.19"
```

### Node.js module

```
const packageFinder = require('package-finder')

let result = packageFinder([<folders>], [<packages>])
console.log(JSON.stringify(result, null, 4))
```

### Package version

Internally `package-finder` makes use of
[`semver.satisfies`](https://docs.npmjs.com/misc/semver) to match the package
version
