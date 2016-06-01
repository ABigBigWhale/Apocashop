#!/bin/bash
# uglifies apocashop code

uglifyjs js/config.js js/Apocashop.js js/LoadState.js js/StartState.js js/PlayState.js js/EndState.js js/palette.js js/EndingScreen.js js/DisplayManager.js js/SoundManager.js js/AssetManager.js js/StockUI.js js/backend/ResetHelper.js js/backend/EventManager.js js/backend/AnalyticsWrapper.js js/backend/resources.js js/backend/utility.js js/backend/Timer.js js/backend/ConditionManager.js js/backend/QuestionManager.js js/backend/npcGen.js js/backend/PlotGarnisher.js js/backend/HeroManager.js js/backend/JeffInserter.js js/backend/HeroGenerator.js js/backend/dayGen.js js/backend/DialogManager.js js/backend/InteractionManager.js js/backend/PlayerState.js js/backend/Stock.js js/backend/Jeff.js js/backend/WrapupManager.js js/backend/FlowManager.js -o ../apocashop.min.js -c -m -e