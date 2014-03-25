jQuery.fn.slider1 = function(id, images, attr) {
	/*
	 * id - id in form 'id' withou '#' sign
	 * images - array of sources
	 * attr - slider's attributes
	 * 	width
	 * 	height
	 * 	pause - time to see the image
	 * 	speed - of change the pictures
	 * 	slices - slices number
	 * 	boxCols, boxRows
	 */

	attr = attr || {};

	var width = attr.width = attr.width || 210,
	    height = attr.height = attr.height || 292,
	    pause = attr.pause = attr.pause || 2000,
	    speed = attr.speed = attr.speed || 3000;

	attr.slices = attr.slices || 8;
	attr.boxCols = attr.boxCols || 7;
	attr.boxRows = attr.boxRows || 7;
	var paper = Snap(id);
	var imgs = new Array;
	for(var i = 0; i < images.length; i++) imgs.push(paper.image(images[i], 0, 0, width, height));



	var eBox = (function(paper, attr) {
		 var width = attr.width,
	    		height = attr.height,
	    		speed = attr.speed,
	    		boxCols = attr.boxCols,
	    		boxRows = attr.boxRows,
	    		boxWidth = width / boxCols,
	    		boxHeight = width / boxRows,
	    		total = boxRows * boxCols,
	    		boxSpeed = (speed / total) * 15,
	    		boxes = new Array,
	    		timeBuf,
	    		random;
		var maskGr = paper.g();
		var r = paper.rect(0, 0, 0, 0);
		var opaque = paper.rect(0, 0, width, height);
		opaque.attr({
			fill: "#fff",
		});

		maskGr.add(opaque);

		for(row = 0; row < boxRows; row++) {
			boxes[row] = new Array;
			for(col = 0; col < boxCols; col++) {
				var rect = paper.rect(col * boxWidth, row * boxHeight, boxWidth, boxHeight);
				rect.attr({
					'stroke-width': 0,
				});
				maskGr.add(rect);
				boxes[row].push(rect);
			}
		}

		r.attr({
			mask: maskGr,
		});
		
		return function(effect, image, callback) {
			/* reset all transparents */
			random = new Array;
			for(row = 0; row < boxRows; row++){ 
				for(col = 0; col < boxCols; col++) {
					random.push(boxes[row][col]);
					boxes[row][col].attr({
						'fill': '#fff',
					});
				}
			}


			/* set the mask */
			image.attr({
				mask: maskGr,
			});

			/* apply effects */
			switch(effect) {
				case 'boxRandom': 
					timeBuf = 0;
					while(random.length > 1){
						var rIndex = Math.floor(Math.random() * random.length);
						var image = random.splice(rIndex, 1)[0];
						setTimeout( (function(img){
							return function() {
								img.animate({
									'fill': '#000',
								}, boxSpeed);
							}
						})(image), timeBuf);
						timeBuf += 50;
					};

					setTimeout(function() {
						random[0].animate({
							'fill': '#000',
						}, boxSpeed, callback);
					}, timeBuf);
					break;
				case 'boxRightBottom': 
					timeBuf = 0;
					var diagonals = Math.max(boxCols, boxRows);
					var i, minI, maxI, col, row;
					for(var diagonal = diagonals - 1; diagonal > (1 - diagonals); diagonal--) {
						for(col = diagonal; col < boxCols; col++) { 
							row = boxRows -(col - diagonal) - 1;
							if(col >= 0 && col < boxCols && row < boxRows && row >= 0) {
								setTimeout((function(img) {
									return function() {
										img.animate({
											'fill': "#000"
										}, boxSpeed);
									}
								}) (boxes[row][col]), timeBuf);
							}
						}	

						timeBuf += 250;
					}

					setTimeout(function() {
						boxes[0][0].animate({
							'fill': '#000',
						}, boxSpeed, callback);
					}, timeBuf);
					break;
			};
			
		};
	})(paper, attr);
	var eSlice = (function(paper, attr) {
		 var width = attr.width,
	    		height = attr.height,
	    		speed = attr.speed,
	    		slices = attr.slices,
	    		sliceWidth = width / slices,
	    		sliceSpeed = speed / slices,
	    		transparents = [],
	    		timeBuf;
		var maskGr = paper.g();
		var opaque = paper.rect(0, 0, width, height);
		opaque.attr({
			fill: "#fff",
		});

		maskGr.add(opaque);

		for(i = 0; i < slices; i++) {
			var rect = paper.rect(i * sliceWidth, 0, height, sliceWidth);
			rect.attr({
				fill: "#fff",
				'stroke-width': 0,
			});
			maskGr.add(rect);
			transparents.push(rect);
		}
		
		return function(effect, image, callback) {
			/* reset all transparents */
			for(i = 0; i < slices; i++) transparents[i].attr({fill: "#fff", width: sliceWidth, x: i * sliceWidth, y: 0, height: height});
			timeBuf = 0;

			/* set the mask */
			image.attr({
				mask: maskGr,
			});

			/* apply effects */
			switch(effect) {
				case 'sliceDownLeft': 
					for(i = 0; i < slices; i++) {
						if(i == slices - 1) {
							setTimeout(function() {
								transparents[slices - 1].animate({
									fill: "#000",
								}, sliceSpeed, callback);
							}	
							,timeBuf);
						} else {
							setTimeout(( function(j) { 
								return function() {
									transparents[j].animate({
										fill: "#000",
									}, sliceSpeed);
								}})(i)
							,timeBuf);
						}
						timeBuf += 50;
					};
					break;
				case 'sliceDownRight': 
					for(i = slices - 1; i >= 0; i--) {
						if(i == 0) {
							setTimeout(function() {
								transparents[0].animate({
									fill: "#000",
								}, sliceSpeed, callback);
							}	
							,timeBuf);
						} else {
							setTimeout(( function(j) { 
								return function() {
									transparents[j].animate({
										fill: "#000",
									}, sliceSpeed);
								}})(i)
							,timeBuf);
						}
						timeBuf += 50;
					};
					break;
				case 'foldRight': 
					for(i = slices - 1; i >= 0; i--) {
						transparents[i].attr({
							fill: "#000",
							width: 0,
						});
						if(i == 0) {
							setTimeout(function() {
								transparents[0].animate({
									width: sliceWidth,
								}, sliceSpeed, callback);
							}	
							,timeBuf);
						} else {
							setTimeout(( function(j) { 
								return function() {
									transparents[j].animate({
										width: sliceWidth,
									}, sliceSpeed);
								}})(i)
							,timeBuf);
						}
						timeBuf += 50;
					};
					break;

				case 'foldLeft': 
					for(i = slices - 1; i >= 0; i--) {
						transparents[i].attr({
							fill: "#000",
							width: 0,
							x: (i + 1) * sliceWidth,
						});
						if(i == 0) {
							setTimeout(function() {
								transparents[0].animate({
									width: sliceWidth,
									x: (i - 1) * sliceWidth,
								}, sliceSpeed, callback);
							}	
							,timeBuf);
						} else {
							setTimeout(( function(j) { 
								return function() {
									transparents[j].animate({
										width: sliceWidth,
										x: (j - 1) * sliceWidth,
									}, sliceSpeed);
								}})(i)
							,timeBuf);
						}
						timeBuf += 50;
					};
					break;
			};
			
		};
	})(paper, attr);
	var eCentralSquare = (function(paper, attr) {
		 var width = attr.width,
	    		height = attr.height,
	    		speed = attr.speed;
		var maskGr = paper.g();
		var opaque = paper.rect(0, 0, width, height);
		opaque.attr({
			fill: "#fff",
		});

		var transparent = paper.rect(width/2, height/2, 0, 0);
		transparent.attr({
			fill: '#000',
		});

		maskGr.add(opaque, transparent);


		return function(image, callback) {
			image.attr({
				mask: maskGr,
			});
			transparent.attr({
				x: width / 2,
				y: height / 2,
				width: 0,
				height: 0,
			});
			transparent.animate({
				x: 0,
				y: 0,
				width: width,
				height: height,
			}, speed, callback);
			
		};
	})(paper, attr);

	var eSimpleOpacity = (function(paper, attr) {
		 var width = attr.width,
	    		height = attr.height,
	    		speed = attr.speed;
		var rect = paper.rect(0, 0, width, height);

		return function(image, callback) {
			rect.attr({
				fill: "#fff",
			});

			image.attr({
				mask: rect,
			});

			rect.animate({
				fill: "#000",
			}, speed, callback);
			
		};
	})(paper, attr);

	var Slider = function(images, attr) {
		attr = attr || {};
		var width = this.width = attr.width || 292;
		var height = this.height = attr.height || 210;
		this.speed = attr.speed;
		this.pause = attr.pause;
		this.images = images;
		var paper = this.paper = this.images[0].paper;
		this.length = this.images.length;
		this.current = this.length;

		var eSliceDownLeft = _.partial(eSlice, 'sliceDownLeft');
		var eSliceDownRight = _.partial(eSlice, 'sliceDownRight');
		var eFoldRight = _.partial(eSlice, 'foldRight');
		var eFoldLeft = _.partial(eSlice,  'foldLeft');
		var eBoxRandom = _.partial(eBox,  'boxRandom');
		var eBoxRightBottom = _.partial(eBox,  'boxRightBottom');

		this.effects = [eCentralSquare, eSimpleOpacity, eSliceDownLeft, eSliceDownRight, eFoldRight, eFoldLeft, eBoxRandom, eBoxRightBottom];
		this.group = paper.g(); 
		for(var i = 0; i < this.length; i++) this.group.add(this.images[i]);
	};

	Slider.prototype.resetImage = function(image) {
			image.node.removeAttribute('mask');
	};

	Slider.prototype.processImage = function() {
		var that = this;
		var current = that.current = ((that.current - 1 + that.length) % that.length) ;
		var image = that.images[current];
		var effectIndex = Math.floor(Math.random() * that.effects.length);
		var date1 = new Date;

		that.effects[effectIndex](image, function() {

			that.resetImage(image);
			that.imageToBack(image);

			setTimeout(function() { that.processImage();}, that.pause);
			 
		});
	};


	Slider.prototype.imageToBack = function(image) {
		this.group.prepend(image);
	};

	var slider = new Slider(imgs, attr);
	slider.processImage();
}
