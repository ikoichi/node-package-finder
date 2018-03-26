Find where a package is used

## Installation

```
npm install -g package-finder
```

## Usage
```
Usage: package-finder -packages [packages] -folders [folders]

Opzioni:
  --help          Mostra la schermata di aiuto                        [booleano]
  --version       Mostra il numero di versione                        [booleano]
  -f, --folders   comma separated list of folders to look into       [richiesto]
  -p, --packages  comma separated list of package names              [richiesto]
```
```
package-finder -f ./ -p lodash
```
