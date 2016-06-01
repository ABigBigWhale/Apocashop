The dialog system has four special characters -

These two are made to be inserted manually into dialog
@ - Adds a 200ms pause
/ - Inserts a line break with a 200ms pause

These two should NOT be used. They should only be added by premade processor functions.
^ - Splits a message into two screens
| - Inserts a line break with no pause


To add a multi-line message for a character, just make the message an array, with each
string in the array representing one screen of text. The query system will deal with
inserting the symbols that need to be there.