## air-quality-belgium-app

This repository contains a customised version of [52°North JavaScript Sensor Web Client  app](https://github.com/irceline/js-sensorweb-client-app) specifically for air quality data in Belgium.

The package can be pulled into [Adobe® PhoneGap™ Build](https://build.phonegap.com) to compile for Android, iOS and Windows Phone.

## Customisations
customisations are marked in js/jsc-1.0.0.js with:
```
// customIRCELINE
```
* upgrade leaflet.js 0.7.1 > 0.7.3 (see js/jsc-1.0.0.deps.js)
* added layers (see customIRCELINE.js)
* added custom styling (see customIRCELINE.css)
* double-click on phenomenon in listing to zoom to extend of specific phenomenon

## Acknowledgement
This app was created within the [eENVplus project](http://www.eenvplus.eu) funded by European Union under the Competitiveness and Innovation Framework Programme – Information and Communication Technologies Policy Support Programme ([CIP-ICT-PSP](http://ec.europa.eu/cip/)) grant No. 325232.

The development was performed by [Sinergis srl](http://www.sinergis.it) and [IRCEL-CELINE](http://www.irceline.be)
