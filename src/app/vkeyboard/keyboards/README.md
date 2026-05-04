## Add keyboard based on a specific language.

Step 1. Go to https://kbdlayout.info/ and select the keyboard for a specific language.
Step 2. Click on "XML CLDR LDML" link (it will redirect to a xml file).
Step 3. Copy the link form Step 2 and load the xml file in https://www.utilities-online.info/xmltojson. Convert the xml file to json.
Step 4. Go to https://jsonformatter.curiousconcept.com/ and format the json file.
Step 5. Add a new file with the new json data in the keyboards folder (ex: danish.keyboard.dtd.ts).
Step 6. Add the necessary code for that file in the VKeyboardComponent (setLanguage method).


