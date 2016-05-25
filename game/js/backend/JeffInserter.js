function JeffInserter(game) {

	this.insertJeff = function(day, index) {
		day.sequence[0] = getRandomStart(index);
		day.sequence[9999] = getRandomEnd(index);
	};

	function getRandomStart(index) {
		var randomJeff = randomElement(Object.keys(heroes.jeffPoolStart));
		return generateHeroData("jeffPoolStart", randomJeff);
	}

	function getRandomEnd(index) {
		var randomJeff = randomElement(Object.keys(heroes.jeffPoolEnd));
		return generateHeroData("jeffPoolEnd", randomJeff);
	}

}