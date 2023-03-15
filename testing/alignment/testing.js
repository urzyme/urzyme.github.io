

LEVEL_1_COL = "#a6a6a6";
LEVEL_2_COL = "#d3d3d3";
LEVEL_3_COL = "white";
LEVEL_4_COL = "#ba2e0066";

STRAND_ARROW_HEAD_LEN_1 = 5;
STRAND_ARROW_HEAD_LEN_2 = 6;
STRAND_ARROW_BASE_WIDTH = 7;
STRAND_ARROW_HEAD_WIDTH = 13;
HELIX_WIDTH = 11;
HELIX_CORNER_RADIUS = 1.75;


NT_WIDTH = 10;
NT_HEIGHT = 13;
FEATURE_HEIGHT_ALN = 18;
FEATURE_HEIGHT_SEC = 15;
FEATURE_FONT_SIZE = 22;
SEC_WIDTH = 1.0;
SEC_HEIGHT = 23;
NT_FONT_SIZE = 21;
ALN_LABEL_WIDTH = 430;



DATA_1 = {};
DATA_2 = {};

FADE_TIME = 50;


AA_COLS = {A: "#80a0f0", I: "#80a0f0", L: "#80a0f0", M: "#80a0f0", F: "#80a0f0", W: "#80a0f0", V: "#80a0f0",
          K: "#f01505", R: "#f01505",
          D: "#c048c0", E: "#c048c0",
          N: "#15c015", S: "#15c015", Q: "#15c015", T: "#15c015",
          C: "#f08080",
          G: "#f09048",
          P: "#c0c000",
          H: "#15a4a4", Y: "#15a4a4",
          X: "#ffffff"};



// http://bioinformatica.isa.cnr.it/SUSAN/NAR2/dsspweb.html#:~:text=DSSP%20assigns%20seven%20different%20secondary,no%20secondary%20structure%20is%20recognized
AA_COLS_2 = {E: "#FFC20A", H: "#0C7BDC", G: "#0C7BDC", I: "#0C7BDC", T:"#d3d3d3", S: "#d3d3d3",  B: "#d3d3d3",  N: "#ffffff"};
AA_FONT_COLS_2 = {E: "#222222", H: "#222222", G: "#222222", I: "#222222", T:"#222222", S: "#222222",  B: "#222222",  N: "#111111",};


IS_SUPERFAMILY = false;
PAIRWISE = false;

MIN_SSE_LEN = 2;


// Canonical ordering on 3dcomb
CHAIN_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
               "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
               "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];






function drawAlignment(){


	loadAllFiles(1, DATA_1, function() {
		loadAllFiles(2, DATA_2, function() {

			console.log(DATA_1);
			console.log(DATA_2);
			renderSecondary($("#svg1"), DATA_1);
			renderSecondary($("#svg2"), DATA_2);


		});
	});

}





/*
* A domain architecture map in svg
*/
function renderSecondary(svg, DATA){


    // Number of sequences
    var alignment = DATA.secondary;
    var accessions = DATA.accessions;
    var nseq = accessions.length;
    var nsites = alignment[accessions[0]].length;
    var features = DATA.features;


    console.log("rendering alignment with", nseq, nsites)


    svg.html("");
    svg.height(SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*5);
    svg.width(SEC_WIDTH*(nsites+100) + ALN_LABEL_WIDTH);


    // Groups
    var svgAnnotation = $(drawSVGobj(svg, "g", {class: "annotation"}));
    var svgHighlight = $(drawSVGobj(svg, "g", {class: "highlight"}))
    var svgContent = $(drawSVGobj(svg, "g", {class: "content"}));

		// Site numbering
    for (var site = 0; site < nsites; site++){
       
        var x = SEC_WIDTH*(site) + ALN_LABEL_WIDTH;

      if (site == 0 || (site+1) % 100 == 0){
      	var y = SEC_HEIGHT*0.5;
        drawSVGobj(svgContent, "text", {x: x + 2, y: y, style: "text-anchor:start; dominant-baseline:central; font-family:Source sans pro; font-size:" + NT_FONT_SIZE + "px"}, value=site+1)
		drawSVGobj(svgAnnotation, "line", {x1:x, x2:x, y1:SEC_HEIGHT*0.25, y2:SEC_HEIGHT*(nseq+1.5), style:"stroke:#222222;stroke-width:0.5px"})
   
	  	}else if((site+1) % 50 == 0){
	  		drawSVGobj(svgAnnotation, "line", {x1:x, x2:x, y1:SEC_HEIGHT, y2:SEC_HEIGHT*(nseq+1.5), style:"stroke:#222222;stroke-width:0.25px"})
	  	}
    }


     // Features
    for (let feature in features){


      let range = features[feature].range;
      let level = features[feature].level;
      let textAlign = features[feature].align;
      if (textAlign == "right"){
      	textAlign = "end";
      }else{
      	textAlign = "start";
      }
      let featureCount = features[feature].count; 
      let featureDY = features[feature].dy; 
      if (range == "") continue;
      range = range.split("-")
      var y = SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*(level-0.5);
      var lower = getAlignmentPosFromUngapped(features[feature].acc, range[0], DATA);
      var upper = lower;
      var x1 = SEC_WIDTH*(lower) + ALN_LABEL_WIDTH;
      var x2 = x1 + NT_WIDTH;
      if (range.length == 2){
        upper = getAlignmentPosFromUngapped(features[feature].acc, range[1], DATA);
        x2 = SEC_WIDTH*(upper + 1) + ALN_LABEL_WIDTH;
      }




      var textCol = "black";
      var col = level == 1 ? LEVEL_1_COL : level == 2 ? LEVEL_2_COL : level == 3 ? LEVEL_3_COL : LEVEL_4_COL;
      var txt = feature;
		  var lw = 0; //0.7;
		  if (level == 3){
	       lw = 0.7;
      }
	  
	  	let textX = textAlign == "left" ? x1 : x1;

	  	let textFeature = null;
	  	let featureBg = null;
      if (level == 0){
        continue;
      }else if (featureCount != null){

      	// Only draw around a few sequences
      	let yAcc = -1;
      	for (let seqNum = 0; seqNum < nseq; seqNum++){
		      let accSeq = accessions[seqNum];
		      if (accSeq == features[feature].acc){
		      	yAcc = (seqNum+1)*SEC_HEIGHT;
		      	if (featureDY != null) {
		      		yAcc= (seqNum+1+featureDY)*SEC_HEIGHT;
		      	}
		      	break;
		      }

		    }



		    if (yAcc != -1){



      		drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: yAcc, width: x2-x1, height:SEC_HEIGHT*featureCount, style:"stroke-width:" +  lw + "px; stroke:black; fill:" + "white"});
					featureBg = drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: yAcc, width: x2-x1, height:SEC_HEIGHT*featureCount, style:"stroke-width:" +  lw + "px; stroke:black; fill:" + col});

	      	// Triangle
	      	let yBtm = yAcc + SEC_HEIGHT*(featureCount+0.5);
			let points = (x1-NT_WIDTH/4) + "," + (yBtm-SEC_HEIGHT/8) + " " + (x1+NT_WIDTH/4) + "," + (yBtm-SEC_HEIGHT/8) + " " + x1 + "," + (yBtm-SEC_HEIGHT/2);
	  	  	drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0px; stroke:black; fill:" + "white"} ) // Triangle
	  	  	drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0.7px; stroke:black; fill:" + col} ) // Triangle


	  	  	// Text
	  	  	textFeature = drawSVGobj(svgContent, "text", {lower: lower, upper:upper,  x: textX, y: yBtm-SEC_HEIGHT/20, style: "cursor:pointer; text-anchor:" + textAlign + "; dominant-baseline:hanging; font-size:" + FEATURE_FONT_SIZE*0.8 + "px; fill:" + textCol}, value=txt)
	  	  



      	}
      }else {
      		let rectY = level == 4 ? 0 : SEC_HEIGHT;
      		let rectHeight = level == 4 ? SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*(level-1) : SEC_HEIGHT*nseq + FEATURE_HEIGHT_SEC*(level-1);
		    drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: rectY, width: x2-x1, height:rectHeight, style:"stroke-width:" +  lw + "px; stroke:black; fill:" + "white"});
			featureBg = drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: rectY, width: x2-x1, height:rectHeight, style:"stroke-width:" +  lw + "px; stroke:black; fill:" + col});
      

      	// Triangle
				let points = (x1-NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + (x1+NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + x1 + "," + (y-SEC_HEIGHT/2);
  	  	drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0px; stroke:black; fill:" + "white"} ) // Triangle
  	  	drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0.7px; stroke:black; fill:" + col} ) // Triangle
  	  	


  	  	// Text
	  	 	textFeature = drawSVGobj(svgContent, "text", {lower: lower, upper:upper,  x: textX, y: y-SEC_HEIGHT/20, style: "cursor:pointer; text-anchor:" + textAlign + "; dominant-baseline:hanging; font-size:" + FEATURE_FONT_SIZE + "px; fill:" + textCol}, value=txt)
	  	  



      }

     }





    // Sequence labels
    for (let seqNum = 0; seqNum < nseq; seqNum++){
      let acc = accessions[seqNum];
	  	let accPrint = getNameOfAccession(acc, DATA);
      let y = SEC_HEIGHT*(seqNum+1.5)
      let x = ALN_LABEL_WIDTH - 2.5*NT_FONT_SIZE;
	  
	  
	  // Domain image
	  let domainOfLife = getLifeDomainOfAccession(acc, DATA);
	  if (domainOfLife != null){
		   //let domainEle = drawSVGobj(svgContent, "image", {href:"/fig/" + domainOfLife + ".png", x: x+NT_FONT_SIZE, y: y-NT_FONT_SIZE/2, pdb: acc, height:NT_FONT_SIZE})


		   let letter = domainOfLife.substring(0, 1);
		   if (letter == "M") letter = "O";
		   drawSVGobj(svgContent, "text", {x: x+NT_FONT_SIZE, y: y, style: "text-anchor:middle; fill:black; dominant-baseline:central; font-size:" + NT_FONT_SIZE + "px"}, value=letter)
		
		   
		   
	  }
	 

		// Click on an accession to select it
		drawSVGobj(svgContent, "text", {x: x, y: y, pdb: acc, style: "text-anchor:end; fill:#366BA1; dominant-baseline:central; font-size:" + NT_FONT_SIZE + "px"}, value=accPrint)
		



    }
	


    // Secondary structure
    for (var seqNum = 0; seqNum < nseq; seqNum++){
      var acc = accessions[seqNum];
      var seq = alignment[acc];
      var y = SEC_HEIGHT*(seqNum+1.5)


      let sseGroup = drawSVGobj(svgContent, "g", { accession: acc, class: "domainSeq", select: "na" });


      // Find contiguous regions of helix, strand, loop, or gap
      var SSEs = [];
      var symbol = seq[0];
  	  if (symbol == "I" || symbol == "G") symbol = "H"; // Helix
  	  if (symbol == "S" || symbol == "B" || symbol == "T") symbol = "N"; // Loop etc
      var start = 0;
      for (var site = 1; site < nsites; site++){

          var symbol2 = seq[site];
      		if (symbol2 == "I" || symbol2 == "G") symbol2 = "H"; // Helix
      		if (symbol2 == "S" || symbol2 == "B"  || symbol2 == "T") symbol2 = "N"; // Loop etc




      		// Ignore all gaps / loops of length 1 within an sse for asthetic purposes

      		if (site < nsites-1 && (symbol2 == "-" || symbol2 == "N")){
      				let symbolNext = seq[site+1];
      				if (symbolNext == "I" || symbolNext == "G") symbolNext = "H"; // Helix
      				if (symbolNext == "S" || symbolNext == "B"  || symbolNext == "T") symbolNext = "N"; // Loop etc
      				if (symbol == symbolNext){
      					symbol2 = symbolNext;
      				}
      				
      		}

          if (symbol != symbol2){
              var sse = {seqNum: seqNum, start: start, stop: site-1, element: symbol};
              symbol = symbol2;
              start = site;
              SSEs.push(sse);
          }




      }


      // Plot them
      for (let i = SSEs.length-1; i >= 0; i --){



        let sse = SSEs[i];


        

        let startX = (sse.start)*SEC_WIDTH + ALN_LABEL_WIDTH;
        let endX = (sse.stop+1)*SEC_WIDTH + ALN_LABEL_WIDTH;
        let sseLen = sse.stop - sse.start + 1;

        let colourModifier = "";


        // Gap - do nothing
        if (sse.element == "-"){
          //console.log(acc, "gaps", sse);

        }

        // Helix
        else if ((sse.element == "H")  && sseLen >= MIN_SSE_LEN){

          //console.log(acc, "helix", sse);

          // Cylinder if long, rect if short
          if (sseLen > 1){


          	startX = startX + HELIX_CORNER_RADIUS/2;
          	endX = endX - HELIX_CORNER_RADIUS/2;

          	// Right circle
          	drawSVGobj(sseGroup, "ellipse", {cx: endX, cy: y, rx: HELIX_CORNER_RADIUS, ry: HELIX_WIDTH/2, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["H"] + colourModifier} );
       
       			// Rect
          	drawSVGobj(sseGroup, "rect", {x: startX, y: y-HELIX_WIDTH/2, width: endX-startX, height: HELIX_WIDTH, style: "stroke-width:0px; fill:" + AA_COLS_2["H"] + colourModifier} );
         
         		// Border around rect
	         	drawSVGobj(sseGroup, "line", {x1: startX, x2: endX, y1: y-HELIX_WIDTH/2, y2: y-HELIX_WIDTH/2, style: "stroke-width:1px; stroke: black"} );
	         	drawSVGobj(sseGroup, "line", {x1: startX, x2: endX, y1: y+HELIX_WIDTH/2, y2: y+HELIX_WIDTH/2, style: "stroke-width:1px; stroke: black"} );
         

         		// Left circle
	          drawSVGobj(sseGroup, "ellipse", {cx: startX, cy: y, rx: HELIX_CORNER_RADIUS, ry: HELIX_WIDTH/2, style: "stroke-width:0px; fill:white"} );
          	drawSVGobj(sseGroup, "ellipse", {cx: startX, cy: y, rx: HELIX_CORNER_RADIUS, ry: HELIX_WIDTH/2, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["H"] + "aa"} );
         
          }else{
          	 drawSVGobj(sseGroup, "rect", {rx: HELIX_CORNER_RADIUS, x: startX, y: y-HELIX_WIDTH/2, width: endX-startX, height: HELIX_WIDTH, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["H"] + colourModifier} );
         
          }

        }

        // Strand
        else if (sse.element == "E" && sseLen >= MIN_SSE_LEN){

          // Arrow
          var x2 = endX - STRAND_ARROW_HEAD_LEN_1;
          var x3 = endX - STRAND_ARROW_HEAD_LEN_2;


          // To avoid a tiny arrow head
          if (sse.stop - sse.start + 1 < 4){
            x2 = x2 + STRAND_ARROW_HEAD_LEN_1/2;
            x3 = x3 + STRAND_ARROW_HEAD_LEN_1/2;
          }


          var points = startX + "," + (y-STRAND_ARROW_BASE_WIDTH/2);
          points += " " + x2 + "," + (y-STRAND_ARROW_BASE_WIDTH/2);
          points += " " + x3 + "," + (y-STRAND_ARROW_HEAD_WIDTH/2);
          points += " " + endX + "," + y;
          points += " " + x3 + "," + (y+STRAND_ARROW_HEAD_WIDTH/2);
          points += " " + x2 + "," + (y+STRAND_ARROW_BASE_WIDTH/2);
          points += " " + startX + "," + (y+STRAND_ARROW_BASE_WIDTH/2);

          drawSVGobj(sseGroup, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["E"] + colourModifier} )

        }

        // Loop etc
        else{


          //console.log(acc, "loop", sse);

          drawSVGobj(sseGroup, "line", {x1: startX, x2: endX, y1: y, y2: y, style: "stroke-linecap:round; stroke-width:1px; stroke:#000000" + colourModifier} )

        }

      }


      //console.log("SSE", SSEs);


    }



    svg.show();


}



// Return the domain (of life) for a sequence
function getLifeDomainOfAccession(acc, DATA){
	
	acc = acc.replace(".pdb", "");
	let metadata = DATA.metadata[acc];
	if (metadata == null){
		console.log("cannot find", acc);
		return null;
	}

	return metadata.domain;
	
	
}



/*
	Find the position in alignment from ungapped position within one sequence
*/
function getAlignmentPosFromUngapped(accession, accPos, DATA){


	accPos = parseFloat(accPos);




	let accessions = DATA.accessions;
	let alignment = DATA.alignment;
	let nsites = alignment[accessions[0]].length;
	let siteSeq = 0;


	if (alignment[accession] == null){
		console.log("cannot find", accession, "in alignment");
	}


	for (let siteAln = 0; siteAln < nsites; siteAln++){


		if (siteSeq == accPos){
			return siteAln;
		}

		let symbol = alignment[accession][siteAln];
		if (symbol != "-"){
			siteSeq++;
		}

	}

	return -1;


}




function loadAllFiles(classNr = 1, data, resolve = function() { }){


  // Read info json
  fetch("class" + classNr + ".json").then(response => response.text()).then(text => loadJSON(text, classNr, data, resolve));


}



// Load the json contents into data
function loadJSON(text, classNr, data, resolve=function() { }){


	text = text.replaceAll("\n", "").replaceAll("\r", "");
	var json = JSON.parse(text);
	data.features = json.features;


	 // Load accessions
 	 fetch("/data/accessions.json").then(response => response.text()).then(text => loadAcccessionMetadata(text, classNr, data, resolve));

}


function loadAcccessionMetadata(text, classNr, data,  resolve = function() { }){
	
	
	
	text = text.replaceAll("\n", "").replaceAll("\r", "");
	let json = JSON.parse(text);
	console.log(json);
	data.metadata = json;
	
	// features[feature] = {range: range, level: level};

	// Load alignment
  	fetch("class" + classNr + ".fasta").then(response => response.text()).then(text => loadAlignment(text,  classNr, data, resolve));
	
}


function loadAlignment(fasta,  classNr, data, resolve = function() { }){

  //console.log("loading alignment", fasta)
  var lines = fasta.split("\n");
  var sequences = {};
  var acc = "seq";
  var dir = "";
  var accessions = [];
  var directories = {};
  for (var i = 0; i < lines.length; i ++){

    var line = lines[i];

    if (line.trim() == "") continue;

    if (line[0] == ">"){
      dir = line.substring(1, line.length).trim();
      var acc_split = dir.split("/");
      //acc = acc.replace("structures/", "");
      acc = acc_split[acc_split.length -1];
    }else{
      sequences[acc] = line;
      directories[acc] = dir;
      accessions.push(acc);

    


    }

  }


  data.accessions = accessions;
  data.directories = directories;
  data.alignment = sequences;


  // Load secondary structure alignment
  fetch("class" + classNr + ".secondary.fasta").then(response => response.text()).then(text => loadSecondaryStructureAlignment(text, classNr, data, resolve));


}



function loadSecondaryStructureAlignment(fasta,  classNr, data, resolve = function() { }){

  var lines = fasta.split("\n");
  var sequences = {};
  var acc = "seq";
  var dir = "";
  for (var i = 0; i < lines.length; i ++){

    var line = lines[i];

    if (line.trim() == "") continue;

    if (line[0] == ">"){
      dir = line.substring(1, line.length).trim();
      var acc_split = dir.split("/");
      acc = acc_split[acc_split.length -1];
    }else{
      sequences[acc] = line;
    }

  }

  data.secondary = sequences;

  // All done
  resolve();

}



// Return the official name of a sequence, indepenedent of its file name
function getNameOfAccession(acc, DATA){

	
	acc = acc.replace(".pdb", "");
	let metadata = DATA.metadata[acc];
	if (metadata == null){
		console.log("cannot find", acc);
		return "error";
	}
	
	let isPDB = metadata.pdb != "" && metadata.pdb != "NA";
	
	if (isPDB){
		//return metadata.name + "_" + metadata.species;
	}else{
		//return metadata.name + "_" + metadata.species;
	}
	
	let species = metadata.species.split("_");
	if (species.length > 1){
		species = species[0] + " " + species[1];
	}


	// TrpRS-A and B merged
	let mname = metadata.name;
	if (mname == "TrpRS-A" || mname == "TrpRS-B"){
		mname = "TrpRS";
	}
	let str = species + " (" + mname + ")";
	return str;
	
	
}


  function drawSVGobj(svg, type, attr, val = null){

    //console.log("attr", attr);
    var newObj = document.createElementNS('http://www.w3.org/2000/svg', type);


    for (var a in attr){
      if (a == "text_anchor") newObj.setAttribute("text-anchor", attr[a]);
      else if (a == "stop_color") newObj.setAttribute("stop-color", attr[a]);
      else if (a == "alignment_baseline") newObj.setAttribute("alignment-baseline", attr[a]);
      else if (a == "stroke_dasharray") newObj.setAttribute("stroke-dasharray", attr[a]);
      else newObj.setAttribute(a, attr[a]);
    }
    if (val != null) newObj.innerHTML = val;
    newObj.setAttribute("animatable", "true");


    // Set some of the styles as attributes because safari and IE do not like styles for svgs
    var styles = getComputedStyle(newObj);
    //if (styles.fill != null) newObj.setAttribute("fill", styles.fill);
    if (styles.stroke != null) newObj.setAttribute("stroke", styles.stroke);
    if (styles["stroke-width"] != null) newObj.setAttribute("stroke-width", styles["stroke-width"]);
    //console.log(styles["stroke-width"]);

    //window.requestAnimationFrame(function() {
    svg.append(newObj);
    $(newObj).hide().fadeIn(FADE_TIME); 
    
    
    
    
    return newObj;

  } 
