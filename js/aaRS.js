

DATA = {};
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
AA_COLS_2 = {E: "#FFC20A", H: "#0C7BDC", G: "#0C7BDC", I: "#0C7BDC", T:"#d3d3d3", N: "white", S: "#d3d3d3",  B: "#d3d3d3"};


MIN_SSE_LEN = 3;


SVG_WIDTH = 800;
NT_WIDTH = 10;
NT_HEIGHT = 13;
FEATURE_HEIGHT_ALN = 18;
FEATURE_HEIGHT_SEC = 30;
SEC_WIDTH = 1.2;
SEC_HEIGHT = 20;
NT_FONT_SIZE = 11;
ALN_LABEL_WIDTH = 300;

LEVEL_1_COL = "#fa2a5599";
LEVEL_2_COL = "#a6a6a6";
LEVEL_3_COL = "#d3d3d3";
LEVEL_4_COL = "#ffffff";

STRAND_ARROW_HEAD_LEN_1 = 4;
STRAND_ARROW_HEAD_LEN_2 = 5;
STRAND_ARROW_BASE_WIDTH = 6;
STRAND_ARROW_HEAD_WIDTH = 13;
HELIX_WIDTH = 11;

function renderaaRS(aaRS, aaRS_full_name){


  console.log("rendering", aaRS, aaRS_full_name)


  // Page title
  $("title").html(aaRS_full_name);


  // Main header
  var main = $("#main");
  main.children("h1").html(aaRS_full_name + " (" + aaRS + ")");


	$("#notes").before("<h2>Notes</h21>");

  loadAllFiles(function(){


    console.log(DATA);
    renderAlignment("alignment", "Primary structure", true);
    renderAlignment("alignment2", "Secondary structure", false);
    renderSecondary($("#secondary"));
	
	



  // Footnote
   $("#secondary").parent().after("<div class='footnote'>Extended strands and helices are displayed only if at least " + MIN_SSE_LEN + " residues in length.</div>");
  



  // Tertiary dropdown
  $("#tertiaryTable").append("<div class='dropdownDiv'>Domain: <select id='domainSelect'></select></div>");
  var dropdown = $("#domainSelect");
  dropdown.append("<option value='_full'> Full protein </option>");
  for (var f in DATA.features){
    if (DATA.features[f].level > 1){
      dropdown.append("<option value='" + f + "'>" + f + "</option>");
    }
    
  }
  $(dropdown).on("change", function(){
    $("#tertiary").html("");
    renderTertiary("align.pdb", "superposition");
  });

	
	$("#tertiaryTable").prepend("<div>Click on a secondary structure above to view its tertiary structure.</div>");
	$("#tertiaryTable").prepend("<h2>Tertiary structure</h2>");
	renderTertiary("data/align.pdb", "superposition");


  // Synchronise scroll bars
  $("#alignment").scroll(function () { 
    $("#alignment2").scrollTop($("#alignment").scrollTop());
    $("#alignment2").scrollLeft($("#alignment").scrollLeft());
  });
  $("#alignment2").scroll(function () { 
    $("#alignment").scrollTop($("#alignment2").scrollTop());
    $("#alignment").scrollLeft($("#alignment2").scrollLeft());
  });


  })

	
}

function renderTertiary(pdb, id = "tertiary"){
	
	console.log(pdb);


  // Which domain?
  var domain = $("#domainSelect").val();
  var domainDir = domain.replaceAll(" ", "_");
  if (domain != "_full"){
    pdb = pdb.replace("data/", "")
    pdb = "data/domains/" + domainDir + "/" + pdb ;
  }else{
    pdb = pdb;
  }

	
	var options = {
	  width: 400,
	  height: 400,
	  antialias: true,
	  quality : 'medium'
	};
	
	//pv.Viewer.rm("");
	$("#" + id).html("");
	//$("#" + id).html("");
	var viewer = pv.Viewer(document.getElementById(id), options);
	viewer.rm("*");
	
	// https://pv.readthedocs.io/en/v1.8.1/intro.html
 // asynchronously load the PDB file for the dengue methyl transferase from the server and display it in the viewer.
  pv.io.fetchPdb(pdb, function(structure) {
	  

	  
      // display the protein as cartoon, coloring the secondary structure
      // elements in a rainbow gradient.
      //viewer.cartoon('protein', structure, { color : color.ssSuccession() });
	  if (id == "tertiary"){
		   viewer.cartoon('protein', structure, { color : color.rainbow() });
	  }else{
		   viewer.cartoon('protein', structure, { color : color.byChain() });
	  }
	 
      viewer.centerOn(structure);
	  viewer.setZoom(150);
	  $("#" + id).append("<div class='pdblabel'>" + pdb + "</div>");
	  
  });
  
  

	
	
	
}



function renderSecondary(svg){


    // Number of sequences
    var alignment = DATA.secondary;
    var accessions = DATA.accessions;
    var nseq = accessions.length;
    var nsites = alignment[accessions[0]].length;
    var features = DATA.features;


    console.log("rendering alignment with", nseq, nsites)


    svg.hide();
    svg.html("");
    svg.height(SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*5);
    svg.width(SEC_WIDTH*(nsites+10) + ALN_LABEL_WIDTH);


     // Features
    for (var feature in features){

      var range = features[feature].range;
      var level = features[feature].level;
      if (range == "") continue;
      range = range.split("-")
      var y = SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*(level-0.5);
      var x1 = SEC_WIDTH*(parseFloat(range[0])) + ALN_LABEL_WIDTH;
      var x2 = x1 + NT_WIDTH;
      if (range.length == 2){
        x2 = SEC_WIDTH*(parseFloat(range[1]) + 1) + ALN_LABEL_WIDTH;
      }


      var textCol = "black";
      var col = level == 1 ? LEVEL_1_COL : level == 2 ? LEVEL_2_COL : level == 3 ? LEVEL_3_COL : LEVEL_4_COL;
      var txt = feature;
	  var lw = 0; //0.7;
	  if (level == 4){
       lw = 0.7;
      }
	  
      if (level == 0){
        continue;
      }else{
		drawSVGobj(svg, "rect", {x: x1-SEC_WIDTH, y: SEC_HEIGHT, width: x2-x1, height:SEC_HEIGHT*nseq + FEATURE_HEIGHT_SEC*(level-1), style:"stroke-width:" +  lw + "px; stroke:black; fill:" + "white"});
        drawSVGobj(svg, "rect", {x: x1-SEC_WIDTH, y: SEC_HEIGHT, width: x2-x1, height:SEC_HEIGHT*nseq + FEATURE_HEIGHT_SEC*(level-1), style:"stroke-width:" +  lw + "px; stroke:black; fill:" + col});
      }


	  var points = (x1-NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + (x1+NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + x1 + "," + (y-SEC_HEIGHT/2);
	  drawSVGobj(svg, "polygon", {points: points, style: "stroke-width:0px; stroke:black; fill:" + "white"} ) // Triangle
	  drawSVGobj(svg, "polygon", {points: points, style: "stroke-width:0.7px; stroke:black; fill:" + col} ) // Triangle
	  
	  if (feature == "Motif 3"){
		   drawSVGobj(svg, "text", {x: x1+NT_WIDTH/4, y: y-SEC_HEIGHT/20, style: "text-anchor:end; dominant-baseline:hanging; font-size:14px; fill:" + textCol}, value=txt)
	  }else{
		   drawSVGobj(svg, "text", {x: x1-NT_WIDTH/4, y: y-SEC_HEIGHT/20, style: "text-anchor:start; dominant-baseline:hanging; font-size:14px; fill:" + textCol}, value=txt)
	  }
     
    }


	// Site numbering
    for (var site = 0; site < nsites; site++){
      if (site == 0 || (site+1) % 50 == 0){
        var y = SEC_HEIGHT*0.5;
        var x = SEC_WIDTH*(site) + ALN_LABEL_WIDTH;
        drawSVGobj(svg, "text", {x: x, y: y, style: "text-anchor:start; dominant-baseline:central; font-family:Source sans pro; font-size:" + NT_FONT_SIZE + "px"}, value=site+1)
      }
    }

    // Sequence labels
    for (var seqNum = 0; seqNum < nseq; seqNum++){
      var acc = accessions[seqNum];
      var y = SEC_HEIGHT*(seqNum+1.5)
      var x = ALN_LABEL_WIDTH - 10;
      var url = DATA.urls[acc];


      var accPrint = acc.replace(".pdb", "");
      //var textEle = drawSVGobj(svg, "a", {x: x, y: y, href: url, target:"_blank"})
	  

	  
      var ele = drawSVGobj(svg, "text", {x: x, y: y, pdb: acc, style: "text-anchor:end; cursor:pointer; fill:#366BA1; dominant-baseline:central; font-size:" + NT_FONT_SIZE + "px"}, value=accPrint)
		$(ele).bind("click", function(event){
			renderTertiary("data/structures/" + event.target.getAttribute("pdb"));
		});


    }


    // Secondary structure
    for (var seqNum = 0; seqNum < nseq; seqNum++){
      var acc = accessions[seqNum];
      var seq = alignment[acc];
      var y = SEC_HEIGHT*(seqNum+1.5)


      // Find contiguous regions of helix, strand, loop, or gap
      var SSEs = [];
      var symbol = seq[0];
      var start = 0;
      for (var site = 1; site < nsites; site++){

        var symbol2 = seq[site];
        if (symbol != symbol2){

          var sse = {start: start, stop: site-1, element: symbol};
          symbol = symbol2;
          start = site;
          SSEs.push(sse);

        }
      }


      // Plot them
      for (var i = 0; i < SSEs.length; i ++){

        var sse = SSEs[i];


        var startX = (sse.start)*SEC_WIDTH + ALN_LABEL_WIDTH;
        var endX = (sse.stop+1)*SEC_WIDTH + ALN_LABEL_WIDTH;


        // Gap - do nothing
        if (sse.element == "-"){
          //console.log(acc, "gaps", sse);


        }

        // Helix
        else if ((sse.element == "H" || sse.element == "G" || sse.element == "I")  && sse.stop - sse.start + 1 >= MIN_SSE_LEN){

          //console.log(acc, "helix", sse);
          drawSVGobj(svg, "rect", {rx: 2, x: startX, y: y-HELIX_WIDTH/2, width: endX-startX, height: HELIX_WIDTH, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["H"]} );

        }

        // Strand
        else if (sse.element == "E" && sse.stop - sse.start + 1 >= MIN_SSE_LEN){

          // Arrow
          var x2 = endX - STRAND_ARROW_HEAD_LEN_1;
          var x3 = endX - STRAND_ARROW_HEAD_LEN_2;


          var points = startX + "," + (y-STRAND_ARROW_BASE_WIDTH/2);
          points += " " + x2 + "," + (y-STRAND_ARROW_BASE_WIDTH/2);
          points += " " + x3 + "," + (y-STRAND_ARROW_HEAD_WIDTH/2);
          points += " " + endX + "," + y;
          points += " " + x3 + "," + (y+STRAND_ARROW_HEAD_WIDTH/2);
          points += " " + x2 + "," + (y+STRAND_ARROW_BASE_WIDTH/2);
          points += " " + startX + "," + (y+STRAND_ARROW_BASE_WIDTH/2);

          drawSVGobj(svg, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["E"]} )

        }

        // Loop etc
        else{


          //console.log(acc, "loop", sse);

          drawSVGobj(svg, "line", {x1: startX, x2: endX, y1: y, y2: y, style: "stroke-linecap:round; stroke-width:1px; stroke:black"} )

        }

      }


      //console.log("SSE", SSEs);



    }




    svg.show();


}


var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

//Create canvas with the device resolution.
//var myCanvas = createHiDPICanvas(500, 250);




function renderAlignment(divID, main, isPrimary = true){
	

	// Number of sequences
    var alignment = isPrimary ? DATA.alignment : DATA.secondary;
    var accessions = DATA.accessions;
    var nseq = accessions.length;
    var nsites = alignment[accessions[0]].length;

    var features = DATA.features;
	
	
	
	
	// Canvas size
	var w = NT_WIDTH*(nsites+2) + ALN_LABEL_WIDTH;
	var h = NT_HEIGHT*(nseq+1) + FEATURE_HEIGHT_ALN*4.1;
  var maxCanvasWidth = 30000;
  var ratio = Math.min(maxCanvasWidth / w, 3); 
	var canvas = createHiDPICanvas(w, h, ratio);
	$("#" + divID).append(canvas);
	//var canvas = document.getElementById(canvasID);
	//Create canvas with a custom resolution.
	
	//canvas.width  = w;
	//canvas.height = h;
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.textBaseline = "middle";
	
	
	// Sequence labels
    for (var seqNum = 0; seqNum < nseq; seqNum++){
      var acc = accessions[seqNum];
      var y = NT_HEIGHT*(seqNum+1.5)
      var x = ALN_LABEL_WIDTH - 10;
      var url = DATA.urls[acc];


      var accPrint = acc.replace(".pdb", "");
      var cls = DATA.isAlpha[[acc]] ? "alpha" : "pdb";
  
	  ctx.font = NT_FONT_SIZE + "px Source sans pro";
	  ctx.textAlign = "end";
	  ctx.fillText(accPrint, x, y);


    }
	
	 // Site numbering
    for (var site = 0; site < nsites; site++){
      if (site == 0 || (site+1) % 10 == 0){
        var y = NT_HEIGHT*0.5;
        var x = NT_WIDTH*(site+0.25) + ALN_LABEL_WIDTH;
      	
      	//ctx.font = NT_FONT_SIZE + "px Courier New";
      	ctx.textAlign = "start";
      	ctx.fillText(site+1, x, y);


        // Stroke
        ctx.beginPath();
        ctx.moveTo(x-NT_WIDTH/4, y+NT_HEIGHT/2);
        ctx.lineTo(x-NT_WIDTH/4, y-NT_HEIGHT/2);
        ctx.stroke();

      }
    }
	
	
	 // Draw the alignment
    for (var seqNum = 0; seqNum < nseq; seqNum++){

      var acc = accessions[seqNum];
      var seq = alignment[acc];
      var y = NT_HEIGHT*(seqNum+1.5)
      //console.log(acc, seq);
      for (var site = 0; site < nsites; site++){
        var x = NT_WIDTH*(site+0.5) + ALN_LABEL_WIDTH;
        var aa = seq[site];


        //if (aa == "-" && !isPrimary) continue;
        if (aa == "-") continue;


        // Rect
        if (aa != "-") {
          var col = "white";
          if (isPrimary){
            col = AA_COLS[aa];
          }else{
            col = AA_COLS_2[aa];
          }
		  
			ctx.beginPath();
			ctx.fillStyle = col;
			ctx.fillRect(x-NT_WIDTH/2, y-NT_HEIGHT/2, NT_WIDTH+1, NT_HEIGHT);
			ctx.stroke();
          
        }


		// Text
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(aa, x, y);



      }


    }




    // Features
    for (var feature in features){

      var range = features[feature].range;
      var level = features[feature].level;
      if (range == "") continue;
      range = range.split("-")
      var y = NT_HEIGHT*(nseq+1) + FEATURE_HEIGHT_ALN*(level-0.5);
      var x1 = NT_WIDTH*(parseFloat(range[0])) + ALN_LABEL_WIDTH;
      var x2 = x1 + NT_WIDTH;
      if (range.length == 2){
        x2 = NT_WIDTH*(parseFloat(range[1]) + 1) + ALN_LABEL_WIDTH;
      }

      console.log(feature, range, x1, x2);

      var textCol = level == 1 || level >= 3 ? "black" : "white";
      var col = level == 1 ? LEVEL_1_COL : level == 2 ? LEVEL_2_COL : level == 3 ? LEVEL_3_COL : LEVEL_4_COL;
      var txt = feature;
      if (level == 0){
        txt = "*";
        textCol = "black";
        y = y + FEATURE_HEIGHT_ALN;
      }else{
		  
		  
		  ctx.beginPath();
		  ctx.fillStyle = col;
		  ctx.fillRect(x1-NT_WIDTH, y-FEATURE_HEIGHT_ALN/2, x2-x1, FEATURE_HEIGHT_ALN);
		  ctx.stroke();
		  ctx.strokeRect(x1-NT_WIDTH, y-FEATURE_HEIGHT_ALN/2, x2-x1, FEATURE_HEIGHT_ALN);
		  
        //drawSVGobj(svgAlign, "rect", {x: x1-NT_WIDTH, y: y-FEATURE_HEIGHT_ALN/2, width: x2-x1, height:FEATURE_HEIGHT_ALN, style:"stroke-width:0.7px; stroke:black; fill:" + col});
      }



		// Text
		ctx.fillStyle = textCol;
		ctx.font = "14px Source sans pro";
		ctx.fillText(txt, x1-NT_WIDTH + (x2-x1)/2, y);


		//drawSVGobj(svgAlign, "text", {x: x1-NT_WIDTH + (x2-x1)/2, y: y, style: "text-anchor:middle; dominant-baseline:central; font-size:16px; fill:" + textCol}, value=txt)

    }

	
	
	
	// Download fasta
	$("#" + divID).before("<h2>" + main + "</h2>");
	if (isPrimary) $("#" + divID).after("<a href='data/align.ali' style='float:right'>Download fasta</a>");
	
	
}


// Obsolete 
function renderAlignmentSVG(svgAlign, main, isPrimary = true){



    // Number of sequences
    var alignment = isPrimary ? DATA.alignment : DATA.secondary;
    var accessions = DATA.accessions;
    var nseq = accessions.length;
    var nsites = alignment[accessions[0]].length;

    var features = DATA.features;

    //nsites = 200;

    console.log("rendering alignment with", nseq, nsites)


    // Render the alignment onto svg
    
    svgAlign.hide();
    svgAlign.html("");
    svgAlign.height(NT_HEIGHT*(nseq+1) + FEATURE_HEIGHT_ALN*4.1);
    svgAlign.width(NT_WIDTH*(nsites+2) + ALN_LABEL_WIDTH);



    // Sequence labels
    for (var seqNum = 0; seqNum < nseq; seqNum++){
      var acc = accessions[seqNum];
      var y = NT_HEIGHT*(seqNum+1.5)
      var x = ALN_LABEL_WIDTH - 10;
      var url = DATA.urls[acc];


      var accPrint = acc.replace(".pdb", "");
      var cls = DATA.isAlpha[[acc]] ? "alpha" : "pdb";
      var textEle = drawSVGobj(svgAlign, "a", {x: x, y: y, href: url, target:"_blank"})
      drawSVGobj(textEle, "text", {x: x, y: y, class: cls, style: "text-anchor:end; dominant-baseline:central; font-size:" + NT_FONT_SIZE + "px"}, value=accPrint)

    }

    // Site numbering
    for (var site = 0; site < nsites; site++){
      if (site == 0 || (site+1) % 10 == 0){
        var y = NT_HEIGHT*0.5;
        var x = NT_WIDTH*(site) + ALN_LABEL_WIDTH;
        drawSVGobj(svgAlign, "text", {x: x, y: y, style: "text-anchor:start; dominant-baseline:central; font-family:Courier New; font-size:" + NT_FONT_SIZE + "px"}, value=site+1)
      }
    }


    // Draw the alignment
    for (var seqNum = 0; seqNum < nseq; seqNum++){

      var acc = accessions[seqNum];
      var seq = alignment[acc];
      var y = NT_HEIGHT*(seqNum+1.5)
      //console.log(acc, seq);
      for (var site = 0; site < nsites; site++){
        var x = NT_WIDTH*(site+0.5) + ALN_LABEL_WIDTH;
        var aa = seq[site];


        //if (aa == "-" && !isPrimary) continue;
        if (aa == "-") continue;


        // Rect
        if (aa != "-") {
          var col = "white";
          if (isPrimary){
            col = AA_COLS[aa];
          }else{
            col = AA_COLS_2[aa];
          }
          drawSVGobj(svgAlign, "rect", {x: x-NT_WIDTH/2, y: y-NT_HEIGHT/2, width: NT_WIDTH, height:NT_HEIGHT, style:"fill:" + col})
        }



        // Text
        drawSVGobj(svgAlign, "text", {x: x, y: y, style: "text-anchor:middle; dominant-baseline:central; font-family:Courier New; font-size:12px"}, value=aa)

      }


    }


    // Features
    for (var feature in features){

      var range = features[feature].range;
      var level = features[feature].level;
      if (range == "") continue;
      range = range.split("-")
      var y = NT_HEIGHT*(nseq+1) + FEATURE_HEIGHT_ALN*(level-0.5);
      var x1 = NT_WIDTH*(parseFloat(range[0])) + ALN_LABEL_WIDTH;
      var x2 = x1 + NT_WIDTH;
      if (range.length == 2){
        x2 = NT_WIDTH*(parseFloat(range[1]) + 1) + ALN_LABEL_WIDTH;
      }

      console.log(feature, range, x1, x2);

      var textCol = level == 1 || level >= 3 ? "black" : "white";
      var col = level == 1 ? LEVEL_1_COL : level == 2 ? LEVEL_2_COL : level == 3 ? LEVEL_3_COL : LEVEL_4_COL;
      var txt = feature;
      if (level == 0){
        txt = "*";
        textCol = "black";
        y = y + FEATURE_HEIGHT_ALN;
      }else{
        drawSVGobj(svgAlign, "rect", {x: x1-NT_WIDTH, y: y-FEATURE_HEIGHT_ALN/2, width: x2-x1, height:FEATURE_HEIGHT_ALN, style:"stroke-width:0.7px; stroke:black; fill:" + col});
      }



      drawSVGobj(svgAlign, "text", {x: x1-NT_WIDTH + (x2-x1)/2, y: y, style: "text-anchor:middle; dominant-baseline:central; font-size:16px; fill:" + textCol}, value=txt)

    }


  svgAlign.show();


  // Download fasta
  svgAlign.parent().before("<h2>" + main + "</h2>");
  if (isPrimary) svgAlign.parent().after("<a href='data/align.ali' style='float:right'>Download fasta</a>");


}



function loadAllFiles(resolve = function() { }){

  DATA = {};

  // Load features
  fetch("data/features.tsv").then(response => response.text()).then(text => loadFeatures(text, resolve));



}



function loadFeatures(tsv, resolve = function() { }){


  var features = {};
  var lines = tsv.split("\n");
  for (var i = 0; i < lines.length; i++){


    var line = lines[i].trim();
    if (line == "" || line[0] == "#") continue;
    var feature = line.split("\t")[0];
    var range = line.split("\t")[1];
    var level = parseFloat(line.split("\t")[2]);
    features[feature] = {range: range, level: level};



  }

  DATA.features = features;


  // Load alignment
  fetch("data/align.ali").then(response => response.text()).then(text => loadAlignment(text, resolve));


}


function loadAlignment(fasta, resolve = function() { }){

  //console.log("loading alignment", fasta)
  var lines = fasta.split("\n");
  var sequences = {};
  var acc = "seq";
  var accessions = [];
  var isAlpha = {};
  var urls = {};
  for (var i = 0; i < lines.length; i ++){

    var line = lines[i];

    if (line.trim() == "") continue;

    if (line[0] == ">"){
      acc = line.substring(1, line.length).trim();
      acc = acc.replace("structures/", "");
    }else{
      sequences[acc] = line;
      accessions.push(acc);

      // PDB or genbank?
      var accSplit = acc.split(".");
      var url = "";
      if (accSplit.length >= 4 && accSplit[1].length == 1){

        // Genbank
         var accession = accSplit[3];
         //url = "https://www.ncbi.nlm.nih.gov/nuccore/" + accession;
         url = "data/structures/" + acc;
         isAlpha[acc] = true;

      }else{

        // PDB
        var pdb = acc.split("_")[2];
        url = "https://www.rcsb.org/structure/" + pdb;
        isAlpha[acc] = false;

      }
      urls[acc] = url;


    }

  }


  DATA.isAlpha = isAlpha;
  DATA.urls = urls;
  DATA.accessions = accessions;
  DATA.alignment = sequences;

  // Load all pdb files
  fetch("data/structures.txt").then(response => response.text()).then(text => loadStructures(text, resolve));

}


function loadStructures(listOfStructures, resolve){


    // Load dssp files with secondary structure
    var lines = listOfStructures.split("\n");
    var structures = [];
    for (var i = 0; i < lines.length; i ++){

      var fileName = lines[i];
      if (fileName == "" || fileName[0] == "#") continue;
      fileName = fileName.replace("structures/", "dssp/");
      fileName = "data/" + fileName + ".dssp";

      structures.push(fileName);

    }



    DATA.secondary = {};
    loadStructure(structures, resolve);



}





/*
 * Recursively load a list of pdb structures in dssp
*/
function loadStructure(structures, resolve = function() { } ){

  if (structures.length == 0){
    resolve();
    return;
  }

  var fileName = structures.pop();


  fetch(fileName).then(response => response.text()).then(text => {

    console.log("loading pdb", fileName);



    // Find the table
    var lines = text.split("\n");
    var firstLine = -1;
    for (var i = 0; i < lines.length; i ++){

      var line = lines[i];
      if (line.match("#  RESIDUE AA STRUCTURE")){
        //console.log("line 1 is", line);
        firstLine = i;
        break;
      }

    }

    if (firstLine != -1){


      var acc = fileName.replace("data/dssp/", "").replace(".dssp", "");

      // Put secondary stucture into alignment
      var sequence = "";
      var alignmentSequence = DATA.alignment[acc];
      var siteNum = 0;
      for (var alnSiteNum = 0; alnSiteNum < alignmentSequence.length; alnSiteNum++){

        var alnChar = alignmentSequence[alnSiteNum];
        if (alnChar == "-"){

          sequence += "-";
        }else{

          var line = lines[firstLine + siteNum];
          var ss = line.substring(16, 17);
          if (ss == " ") ss = "N";
          sequence += ss;
          siteNum ++;

        }
      }


      DATA.secondary[acc] = sequence;

      //console.log(acc, "has 2nd structure", sequence);


    }else{
      console.log("warning cannot load dssp table for", fileName)
    }


    loadStructure(structures, resolve);

  });



}






  function drawSVGobj(svg, type, attr, val = null){

    //console.log("attr", attr);
    var newObj = document.createElementNS('http://www.w3.org/2000/svg', type);


    for (var a in attr){
      if (a == "text_anchor") newObj.setAttribute("text-anchor", attr[a]);
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
