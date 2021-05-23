[French sport app]

![Screenshoot](https://cdn.apkmonk.com/images/com.newsweb.sports.png "Screenshoot")
INSTALLATION
============

- Avoir un émulateur android ou l'appli mobile "expo" sur son téléphone

Pour installer les dépendances & modules:

> yarn 

DEVELOPPEMENT
=============

Lancer expo via la commande :

> yarn start

Ca va lancer expo dans le navigateur. A partir de là il est possible de lancer sur un émulateur ou sur un téléphone via un qrcode.


MISE EN PRODUCTION
==================

A venir


Lancer l'émulateur :

 > C:\Android\android-sdk\emulator\emulator.exe -avd test


 > Pour réactiver l'analytics firebase : dans app.json, ajouter :
   "android": {
     "googleServicesFile": "./google-services.json"
   }

*NOTE* Avant de créer un build ios, executez cette commande

 > pod install

Android - react-native-webview version <6: This module does not require any extra step after running the link command 

Android - react-native-webview version >=6.X.X: Please make sure AndroidX is enabled in your project by editting android/gradle.properties and adding 2 lines:

android.useAndroidX=true
android.enableJetifier=true




