Description
------------------------------------------------------------------------------
Collection of several @nycplanning ember addons into a mono-addon.  
Included addons:
- [labs-ui](https://github.com/nyCPlanning/labs-ui)
  - `labs-ui` (current version)
  - `deprecated` (legacy version)
- [ember-mapbox-composer](https://github.com/NYCPlanning/ember-mapbox-composer)
- [cartobox-promises-utility](https://github.com/NYCPlanning/cartobox-promises-utility) 
- [labs-ember-search](https://github.com/NYCPlanning/labs-ember-search)
- [ember-needs-async](https://www.npmjs.com/package/ember-needs-async) (A labs specific fork of
an existing project)

## Installation

```
npm install @nycplanning/ember@[version-number]
```

Test against local application
------------------------------------------------------------------------------
1. clone this addon repository to a sibling directory of the target application
2. Update the `dependencies` field of the `package.json` for the target application
to point to the local clone of this addon repository
- `"@nycplanning/ember": "../ose-ember-addons",`

## License

This project is licensed under the [MIT License](LICENSE.md).
