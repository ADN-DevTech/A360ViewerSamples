iOSTranslationTest
==================

This sample shows how to use the API to authenticate and then how to upload a file and monitor the translation progress.

You need to set the API keys in the _UserSettings.h file!

In order to get a file that can be uploaded it uses the DropBox API to get access to the user's DropBox files. To understand how you can enable an application to use the DropBox API, have a look at these articles:
 - http://www.mathiastauber.com/integration-o-dropbox-in-your-ios-application/
 - https://www.dropbox.com/developers/dropins/chooser/ios

It has four buttons:
- Log In: use API to get authenticated
- Select File: select a file from the DropBox account on the iOS device and then store it in an NSData object
- Upload to A360: this creates a bucket on A360 and places the file there, then starts the translation process on it
- Check Progress: check how far the translation process got. If now a thumbnail is available it will also show it on the iOS device



