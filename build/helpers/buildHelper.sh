#!/bin/bash
# uglifies and zips apocashop code

rm apocashop.zip
mkdir ./temp
mkdir ./temp/int
mkdir ./temp/int/js
cp -r ../game/js ./temp/js
if [ "$2" == "scaled" ]
	then
		cp helpers/scaled.html temp/int/index.html
	else
		cp helpers/unscaled.html temp/int/index.html
fi
sed -i -e 's/var SETUP = "DEBUG";/var SETUP = "'$1'";/g' temp/js/config.js
uglifyjs temp/js/config.js temp/js/Kongregate.js temp/js/Apocashop.js temp/js/LoadState.js temp/js/StartState.js temp/js/PlayState.js temp/js/EndState.js temp/js/palette.js temp/js/EndingScreen.js temp/js/DisplayManager.js temp/js/SoundManager.js temp/js/AssetManager.js temp/js/StockUI.js temp/js/backend/ResetHelper.js temp/js/backend/EventManager.js temp/js/backend/AnalyticsWrapper.js temp/js/backend/resources.js temp/js/backend/utility.js temp/js/backend/Timer.js temp/js/backend/ConditionManager.js temp/js/backend/QuestionManager.js temp/js/backend/npcGen.js temp/js/backend/PlotGarnisher.js temp/js/backend/HeroManager.js temp/js/backend/JeffInserter.js temp/js/backend/HeroGenerator.js temp/js/backend/dayGen.js temp/js/backend/DialogManager.js temp/js/backend/InteractionManager.js temp/js/backend/PlayerState.js temp/js/backend/Stock.js temp/js/backend/Jeff.js temp/js/backend/WrapupManager.js temp/js/backend/FlowManager.js -o temp/int/js/apocashop.min.js -c -m -e
cp ./helpers/phaser.min.js temp/int/js/phaser.min.js
cp ../game/main.css temp/int/main.css
cp -r ../game/assets temp/int/assets

cd temp/int
zip -r  ../../apocashop.zip .
cd ../..
rm -r temp