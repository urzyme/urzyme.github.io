

DATA = {};
FADE_TIME = 50;



PV_VIEWERS = {};
PV_PDBS = {};
PV_GEOMS = {};

SELECTED_SITES = {lower: -1, upper: -1};

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
AA_COLS_2 = {E: "#FFC20A", H: "#0C7BDC", G: "#0C7BDC", I: "#0C7BDC", T:"#d3d3d3", S: "#d3d3d3",  B: "#d3d3d3",  N: "#ffffff",};



PAIRWISE = false;

MIN_SSE_LEN = 2;


// Canonical ordering on 3dcomb
CHAIN_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
               "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
               "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];


SVG_WIDTH = 800;
NT_WIDTH = 10;
NT_HEIGHT = 13;
FEATURE_HEIGHT_ALN = 18;
FEATURE_HEIGHT_SEC = 30;
SEC_WIDTH = 1.0;
SEC_HEIGHT = 20;
NT_FONT_SIZE = 11;
ALN_LABEL_WIDTH = 300;

CATALYTIC_DOMAIN_WIDTH = 600;
CATALYTIC_DOMAIN_HEIGHT = 350;
CATALYTIC_DOMAIN_XPAD = 20;
CATALYTIC_DOMAIN_YPAD = 40;
CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1 = 40;
CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2 = 45;
CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP = 0.618;
CATALYTIC_DOMAIN_HELIX_WIDTH_PROP = 0.7;
CATALYTIC_DOMAIN_CUBIC_RIGHT_DX = 0;
CATALYTIC_DOMAIN_LOOP_WIDTH = 3;
CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS = 7;

LEVEL_1_COL = "#fa2a5599";
LEVEL_2_COL = "#a6a6a6";
LEVEL_3_COL = "#d3d3d3";
LEVEL_4_COL = "#ffffff";

STRAND_ARROW_HEAD_LEN_1 = 5;
STRAND_ARROW_HEAD_LEN_2 = 6;
STRAND_ARROW_BASE_WIDTH = 7;
STRAND_ARROW_HEAD_WIDTH = 13;
HELIX_WIDTH = 11;
HELIX_CORNER_RADIUS = 3;

function renderaaRS(isPairwise = false){


  PAIRWISE = isPairwise;

  
	// Read info json
  fetch("info.json").then(response => response.text()).then(text => renderInfo(text));
   

	// Add loading wheel
	$("#alignment").before(`<div id="mainloader" class='loader'><img src='/fig/icon_white.png'></img></div>`);
  
  
  renderHeader();
  

  // Section titles
  $(".summary").prepend("<h2>Summary</h2>");
  $("#flexContainer .notes").prepend("<h2>Introduction</h2>");
  $("#references").prepend("<h2>References</h2>");

  loadAllFiles(function(){


    //console.log(DATA);
    renderAlignment("alignment", true);
    renderAlignment("alignment2", false);
    renderSecondary($("#secondary"));



  
  
  
  // More section titles and download fasta
  $("#alignment").before("<h2>Primary structure</h2>");
  $("#alignment2").before("<h2>Secondary structure</h2>");
  $("#secondary").before("<h2>Domain architecture</h2>");
  $("#secondary").before("<div class='helperNote'>Click on an accession or domain below, or drag a region, to select it.</div>");
  $("#tertiaryTable").prepend("<h2>Tertiary structure</h2>");
  $("#alignment").after("<a href='data/align.ali' style='float:right'>Download fasta</a>");
  $("#alignment2").after("<a href='data/secondary.fasta' style='float:right'>Download fasta</a>");
  
	
	



   // Footnote
   //$("#secondary").parent().before("<div class='footnote'>Extended strands and helices are displayed only if at least " + MIN_SSE_LEN + " residues in length.</div>");
  



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
      clearSelection();
      renderTertiary("data/align.pdb", "superposition");
    });

  if (PAIRWISE) {
    $("#tertiaryTable .dropdownDiv").hide();
  }
	

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


  // Delete loader
  $("#mainloader").remove();



	window.scrollTo({ top: 0, behavior: 'smooth' });

  })

	
}


/*
* Render meta info stored in json file onto page
*/
function renderInfo(text){
	
	text = text.replaceAll("\n", "").replaceAll("\r", "");
	var json = JSON.parse(text);


	// Page title
	$("title").html(json.fullName);

	// Page icon
	$("link[rel='icon']").attr("href", json.icon);
	
	// Page main header
	 $("#main").prepend("<h1>" + json.fullName + "</h1>");
	 
	 

	$(".summary").append("<table></table>");

  // Summary table for families
  if (!PAIRWISE) {
  	$(".summary table").append(`<tr>
  								<th>Name</th>
  								<td>` + json.name + `</td>
  							</tr>`);
  	$(".summary table").append(`<tr>
  								<th>Class</th>
  								<td>` + json.class + `</td>
  							</tr>`);
    $(".summary table").append(`<tr>
                  <th>Subclass</th>
                  <td>` + json.subclass + `</td>
                </tr>`);
  	$(".summary table").append(`<tr title="Amino acid attached to tRNA">
  								<th>Activated substrate</th>
  								<td>` + json.substrate + `</td>
  							</tr>`);
      $(".summary table").append(`<tr title="Amino acid incorporated onto protein">
                  <th>Incorporates</th>
                  <td>` + json.incorporates + `</td>
                </tr>`);
  	$(".summary table").append(`<tr>
  								<th>Oligomerisation</th>
  								<td>` + json.oligo + `</td>
  							</tr>`);

  	$(".summary table").append(`<tr title="Codons in the standard genetic code">
  								<th>Codons</th>
  								<td>` + json.codons + `</td>
  							</tr>`);	
  	$(".summary table").append(`<tr title="Editing is a translational-error prevention mechanism which removes misactivated or mischarged amino acids. It can occur at the pre-transfer level (by removing misactivated resiudes from the active site) or at the post-transfer level (by removing mischarged residues from the tRNA).">
  								<th>Editing</th>
  								<td>` + json.editing + `</td>
  							</tr>`);

  }

  // Summary table for pairwise alignments
  else{

        $(".summary table").append(`<tr>
                  <th>Class</th>
                  <td>` + json.class + `</td>
                </tr>`);
        $(".summary table").append(`<tr>
                <th>Family 1</th>
                  <td>` + json.family1 + `</td>
                </tr>`);
        $(".summary table").append(`<tr>
                <th>Family 2</th>
                  <td>` + json.family2 + `</td>
                </tr>`);
         $(".summary table").append(`<tr>
                  <th>Family 1 RMSD</th>
                  <td>` + json.rmsd1 + ` &#8491;</td>
                </tr>`);
          $(".summary table").append(`<tr>
                  <th>Family 2 RMSD</th>
                  <td>` + json.rmsd2 + ` &#8491;</td>
                </tr>`);
           $(".summary table").append(`<tr>
                  <th>Cross-family RMSD</th>
                  <td>` + json.crossFamilyRmsd + ` &#8491;</td>
                </tr>`);
        $(".summary table").append(`<tr>
                  <th>Total RMSD</th>
                  <td>` + json.rmsdTotal + ` &#8491;</td>
                </tr>`);


        $(".notes div").html(json.description);


  }



  // Catalytic domain archietcture
  if (json.class == "Class I"){
    fetch("catalytic.json").then(response => response.text()).then(text => renderCatalyticDomainInserts(text, 1));
  }

  else if (json.class == "Class II"){
    fetch("catalytic.json").then(response => response.text()).then(text => renderCatalyticDomainInserts(text, 2));
  }
}

function renderTertiary(pdb = null, id = "tertiary") {
	
	var options = {
	  width: 450,
	  height: 450,
	  antialias: true,
	  quality : 'high'
	};
	

  // Reset canvas
  $("#" + id).html("");


  // Try to load it
  if (pdb == null){
    pdb = PV_PDBS[id];
  }

  // Which protein domain?
  //if (pdb != null){
     
    var domain = $("#domainSelect").val();
    var domainDir = domain.replaceAll(" ", "_");
    
    if (domain != "_full"){
      pdb = pdb.replace("data/", "")
      pdb = "data/domains/" + domainDir + "/" + pdb ;
    }else{
      //pdb = pdb.replaceAll("domains/*/", "")
      //pdb = "data/dssp/" + pdb;
    }


  //}
  PV_PDBS[id] = pdb;


  // Load/save viewer
  var viewer = null;
  if (PV_VIEWERS[id] == null){
    viewer = pv.Viewer(document.getElementById(id), options);
  }else{
    viewer = PV_VIEWERS[id];
    viewer.rm("");
    viewer = pv.Viewer(document.getElementById(id), options);
    
  }
  PV_VIEWERS[id] = viewer;

  console.log(pdb);

	
	// https://pv.readthedocs.io/en/v1.8.1/intro.html
 // asynchronously load the PDB file for the dengue methyl transferase from the server and display it in the viewer.
  pv.io.fetchPdb(pdb, function(structure) {

	  
    // Display the protein as cartoon
	  if (id == "tertiary"){
      PV_GEOMS[id] = viewer.cartoon('protein', structure, { color : colourSelected(id, color.ssSuccession) });
	  }else{
      var grad = color.gradient(["red", "blue", "green"]);
		  PV_GEOMS[id] = viewer.cartoon('protein', structure, { color : colourSelected(id, color.bySS) });
	  }
	 
    viewer.centerOn(structure);
	  viewer.setZoom(150);
    //viewer.autoZoom();
	  $("#" + id).append("<div class='pdblabel'>" + pdb + "</div>");
	  
  });
  

	
}




 // Update tertiary colours
function recolourTertiaries(){


  // Full only
  var redraw = false;
  if ($("#domainSelect").val() != "_full"){
    redraw = true;
    $("#domainSelect").val("_full");
  }

    for (var id in PV_VIEWERS){

      if (redraw){
        var pdb = PV_PDBS[id].split("/");
        pdb = pdb[pdb.length-1];
        if (id == "tertiary"){
          pdb = "data/dssp/" + pdb;
        }else{
          pdb = "data/" + pdb;
        }
        
        renderTertiary(pdb, id);

      }

      else {
        if (id == "tertiary"){
          PV_GEOMS[id].colorBy(colourSelected(id, color.ssSuccession));
        }else{
          PV_GEOMS[id].colorBy(colourSelected(id, color.bySS ));
        }
        PV_VIEWERS[id].requestRedraw();
      }
    }


}

// Colour pdb structure by highlighting selected residues
function colourSelected(id, defaultFn) {

  // Default colouring
  if (SELECTED_SITES.lower == -1) {
    return defaultFn();
  }


  // Colour function
  var colorFunc = function(atom, out, index) {

    var chainName = atom.residue().chain().name();
    var chain1Name = atom.residue().chain().structure().chains()[0].name();

    // Get accession
    var pdb = PV_PDBS[id];
    var acc = null;
    if (id == "tertiary"){


      // Main chain only
      if (chainName != chain1Name) {
        out[index+0] = 0.6; out[index+1] = 0.6;
        out[index+2] = 0.6; out[index+3] = 0.8;
        return;
      }

      // Single structure
      acc = pdb.split("/");
      acc = acc[acc.length-1];


    }else{

      // Alignment
      var chainNum = 0;
      for (var chainNum = 0; chainNum < CHAIN_NAMES.length; chainNum++){
        if (CHAIN_NAMES[chainNum] == chainName){
          acc = DATA.accessions[chainNum];
          break;
        }
      }

    }



    // Get site in alignment
    var siteAln = -1;
    var seq = DATA.alignment[acc];
    var nsites = seq.length;
    var resNum = atom.residue().index();
    var pdbIndex = 0;
    for (var siteNum = 0; siteNum < nsites; siteNum++){

      if (seq[siteNum] == "-"){

      }else{

        if (pdbIndex == resNum){
          siteAln = siteNum;
          break;
        }
        pdbIndex++;
      }

    }


    
    // index + 0, index + 1 etc. are the positions in the output array
    // at which the red (+0), green (+1), blue (+2) and  alpha (+3)
    // components are to be written.
    if (siteAln >= SELECTED_SITES.lower && siteAln <= SELECTED_SITES.upper){
      out[index+0] = 0.0; out[index+1] = 0.549;
      out[index+2] = 0.729; out[index+3] = 1.0;
    }else{
      out[index+0] = 0.6; out[index+1] = 0.6;
      out[index+2] = 0.6; out[index+3] = 0.8;
    }


  }

  return new pv.color.ColorOp(colorFunc);


}



/*
* A domain architecture map in svg
*/
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
    svg.width(SEC_WIDTH*(nsites+100) + ALN_LABEL_WIDTH);


    // Groups
    var svgAnnotation = $(drawSVGobj(svg, "g", {class: "annotation"}));
    var svgHighlight = $(drawSVGobj(svg, "g", {class: "highlight"}))
    var svgContent = $(drawSVGobj(svg, "g", {class: "content"}));


    // Residue selection
    const eleSvg = $(svg).get(0); //document.getElementById(svg.attr("id"));
    eleSvg.addEventListener('mousedown', ({clientX, clientY}) => {

      
      var x1 = clientX - svg.offset().left;
      if (x1 <= ALN_LABEL_WIDTH) return;


      SELECTED_SITES = {lower: -1, upper: -1};


      var clearing = false;

      // Clear selection and draw new rectangle
      if (svgHighlight.find(".selectionRect").length > 0){
        svgHighlight.find(".selectionRect").remove();
        clearing = true;
      }
      
      
      var res1 = Math.floor((x1 - ALN_LABEL_WIDTH) / SEC_WIDTH) + 1;

      var rect = drawSVGobj(svgHighlight, "rect", {x: x1-SEC_WIDTH, y: 0, width: 0, height: svg.height(), class: "selectionRect", style: "stroke-width:1px; stroke:black; fill:#008cba55"} )
      var text = drawSVGobj(svgHighlight, "text", {x: SEC_WIDTH*5, y: svg.height() - SEC_WIDTH*5, class: "selectionRect", style: "text-anchor:start; dominant-baseline:auto; font-size:12px"}, "" )



      var mouseMove = function({clientX, clientY}){

        $(svgContent).find("text").attr("class", "");

        var x1_ = x1;
        var x2 = clientX - svg.offset().left;


        if (x1_ > x2){
          var tmp = x1_;
          x1_ = x2;
          x2 = tmp;
        }
        if (x1_ <= ALN_LABEL_WIDTH+1) x1_ = ALN_LABEL_WIDTH+1;
        if (x2 <= ALN_LABEL_WIDTH+1) x2 = ALN_LABEL_WIDTH+1;
        if (x1_ >= svg.width()-2) x1_ = svg.width()-2;
        if (x2 >= svg.width()-2) x2 = svg.width()-2;


        // What are the residue numbers?
        var res1_ = Math.floor((x1_ - ALN_LABEL_WIDTH) / SEC_WIDTH) + 1;
        var res2 = Math.floor((x2 - ALN_LABEL_WIDTH) / SEC_WIDTH) + 1;

        x1_ = res1_ * SEC_WIDTH + ALN_LABEL_WIDTH;
        x2 = res2 * SEC_WIDTH + ALN_LABEL_WIDTH;


        $(rect).attr("x", x1_);
        $(rect).attr("width", x2-x1_);
        $(text).html("Selected sites " + res1_ + "-" + res2);

        return {x1: x1_, x2: x2, res1: res1_, res2: res2};

      }

      var mouseUp = function({clientX, clientY}){




        var coords = mouseMove({clientX, clientY});


        SELECTED_SITES.lower = coords.res1;
        SELECTED_SITES.upper = coords.res2;

        // Clear selection
        if (clearing && SELECTED_SITES.lower >= SELECTED_SITES.upper-1){
          SELECTED_SITES.lower = -1;
          SELECTED_SITES.upper = -1;
          svgHighlight.find(".selectionRect").remove();
        }

        selectSites();


        eleSvg.removeEventListener('mouseup', mouseUp);
        eleSvg.removeEventListener('mouseleave', mouseUp);
        eleSvg.removeEventListener('mousemove', mouseMove);


        


      }


      eleSvg.addEventListener('mouseup', mouseUp);
      eleSvg.addEventListener('mouseleave', mouseUp);
      eleSvg.addEventListener('mousemove', mouseMove);


      

    });



    


     // Features
    for (var feature in features){

      var range = features[feature].range;
      var level = features[feature].level;
      if (range == "") continue;
      range = range.split("-")
      var y = SEC_HEIGHT*(nseq+1) + FEATURE_HEIGHT_SEC*(level-0.5);
      var lower = parseFloat(range[0]);
      var upper = lower;
      var x1 = SEC_WIDTH*(lower) + ALN_LABEL_WIDTH;
      var x2 = x1 + NT_WIDTH;
      if (range.length == 2){
        upper = parseFloat(range[1]);
        x2 = SEC_WIDTH*(upper + 1) + ALN_LABEL_WIDTH;
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
		    drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: SEC_HEIGHT, width: x2-x1, height:SEC_HEIGHT*nseq + FEATURE_HEIGHT_SEC*(level-1), style:"stroke-width:" +  lw + "px; stroke:black; fill:" + "white"});
        drawSVGobj(svgAnnotation, "rect", {x: x1-SEC_WIDTH, y: SEC_HEIGHT, width: x2-x1, height:SEC_HEIGHT*nseq + FEATURE_HEIGHT_SEC*(level-1), style:"stroke-width:" +  lw + "px; stroke:black; fill:" + col});
      }


  	  var points = (x1-NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + (x1+NT_WIDTH/4) + "," + (y-SEC_HEIGHT/8) + " " + x1 + "," + (y-SEC_HEIGHT/2);
  	  drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0px; stroke:black; fill:" + "white"} ) // Triangle
  	  drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:0.7px; stroke:black; fill:" + col} ) // Triangle
  	  
      var text;
  	  if (feature == "Motif 3" || feature == "KMSKS"){
  		   text = drawSVGobj(svgContent, "text", {lower: lower, upper:upper, x: x1+NT_WIDTH/4, y: y-SEC_HEIGHT/20, style: "cursor:pointer; text-anchor:end; dominant-baseline:hanging; font-size:14px; fill:" + textCol}, value=txt)
  	  }else{
  		   text = drawSVGobj(svgContent, "text", {lower: lower, upper:upper,  x: x1-NT_WIDTH/4, y: y-SEC_HEIGHT/20, style: "cursor:pointer; text-anchor:start; dominant-baseline:hanging; font-size:14px; fill:" + textCol}, value=txt)
  	  }


      // Click on a feature to select residues
      $(text).click(function(){
        var ele = $(this);
        svgHighlight.find(".selectionRect").remove();
        $(svgContent).find("text").attr("class", "");
        $(ele).attr("class", "selected");
        console.log(ele.attr("lower"), ele.attr("upper"));
        SELECTED_SITES.lower = parseFloat(ele.attr("lower"));
        SELECTED_SITES.upper = parseFloat(ele.attr("upper"));
        selectSites();
      });
     
    }


	// Site numbering
    for (var site = 0; site < nsites; site++){
      if (site == 0 || (site+1) % 50 == 0){
        var y = SEC_HEIGHT*0.5;
        var x = SEC_WIDTH*(site) + ALN_LABEL_WIDTH;
        drawSVGobj(svgContent, "text", {x: x, y: y, style: "text-anchor:start; dominant-baseline:central; font-family:Source sans pro; font-size:" + NT_FONT_SIZE + "px"}, value=site+1)
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
	  

	  
      // Click on an accession to select ot
      var ele = drawSVGobj(svgContent, "text", {x: x, y: y, pdb: acc, style: "text-anchor:end; cursor:pointer; fill:#366BA1; dominant-baseline:central; font-size:" + NT_FONT_SIZE + "px"}, value=accPrint)
  		$(ele).bind("click", function(event){
        var a = event.target.getAttribute("pdb");
        var directory = DATA.directories[a];
        directory = directory.replace("structures/", "dssp/");
        if (!PAIRWISE) directory = "data/" + directory;
  			renderTertiary(directory);
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
	  if (symbol == "I" || symbol == "G") symbol = "H"; // Helix
	  if (symbol == "S" || symbol == "B" || symbol == "T") symbol = "N"; // Loop etc
      var start = 0;
      for (var site = 1; site < nsites; site++){

        var symbol2 = seq[site];
		if (symbol2 == "I" || symbol2 == "G") symbol2 = "H"; // Helix
		if (symbol2 == "S" || symbol2 == "B"  || symbol2 == "T") symbol2 = "N"; // Loop etc
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
        else if ((sse.element == "H")  && sse.stop - sse.start + 1 >= MIN_SSE_LEN){

          //console.log(acc, "helix", sse);
          drawSVGobj(svgContent, "rect", {rx: HELIX_CORNER_RADIUS, x: startX, y: y-HELIX_WIDTH/2, width: endX-startX, height: HELIX_WIDTH, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["H"]} );

        }

        // Strand
        else if (sse.element == "E" && sse.stop - sse.start + 1 >= MIN_SSE_LEN){

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

          drawSVGobj(svgContent, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + AA_COLS_2["E"]} )

        }

        // Loop etc
        else{


          //console.log(acc, "loop", sse);

          drawSVGobj(svgContent, "line", {x1: startX, x2: endX, y1: y, y2: y, style: "stroke-linecap:round; stroke-width:1px; stroke:black"} )

        }

      }


      //console.log("SSE", SSEs);


    }



    svg.show();


}


function selectSites(){

    // Update canvas colours
    renderAlignment("alignment", true);
    renderAlignment("alignment2", false);

    // Rescroll
    if (SELECTED_SITES.lower != -1){
      var xpos = ALN_LABEL_WIDTH + NT_WIDTH*(SELECTED_SITES.lower) - $("#alignment").parent().width()/2;
      $("#alignment").scrollLeft(xpos);
      $("#alignment2").scrollLeft(xpos);
    }
    


    // Update tertiary colour async
    setTimeout(function(){
      recolourTertiaries();
    }, 1);

}

function clearSelection(){
  $("#secondary").find(".selectionRect").remove();
  SELECTED_SITES = {lower: -1, upper: -1};
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




/*
* Draw a canvas of primary/secondary as an alignment 
*/
function renderAlignment(divID, isPrimary = true){
	

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
  var ratio = Math.min(maxCanvasWidth / w, 2.5); 
	var canvas;
  if ($("#" + divID).find("canvas").length > 0){
    canvas = $("#" + divID).find("canvas").get(0);
  } else{
    canvas = createHiDPICanvas(w, h, ratio);
    $("#" + divID).append(canvas);
  }
	
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
    ctx.fillStyle = "black";
	  ctx.fillText(accPrint, x, y);


    }
	
	 // Site numbering
    for (var site = 0; site < nsites; site++){
      if ((site+1) % 10 == 1){
        var y = NT_HEIGHT*0.5;
        var x = NT_WIDTH*(site+0.25) + ALN_LABEL_WIDTH;
      	
      	//ctx.font = NT_FONT_SIZE + "px Courier New";
      	ctx.textAlign = "start";
        ctx.fillStyle = "black";
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
        //if (aa == "-") continue;


      // Rect
      var col = "";
      var textCol = "#000000";
      if (aa == "-"){
        col = "#ffffff";
      }else if (isPrimary){
        col = AA_COLS[aa];
      }else{
        col = AA_COLS_2[aa];
      }


      // Selected site?
      if (SELECTED_SITES.lower != -1){
        if (site+1 < SELECTED_SITES.lower || site+1 > SELECTED_SITES.upper ){
            //textCol = "white";
            if (aa != "-") {
              col = col + "33";
              textCol = textCol + "88";
            }
        }
      }
      
		  
			ctx.beginPath();
			ctx.fillStyle = col;
			ctx.fillRect(x-NT_WIDTH/2, y-NT_HEIGHT/2, NT_WIDTH+1, NT_HEIGHT+1);
			ctx.stroke();
          
        


        // Text
        if (aa != "-"){
        	ctx.textAlign = "center";
        	ctx.fillStyle = textCol;
        	ctx.fillText(aa, x, y);
        }



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
  var dir = "";
  var accessions = [];
  var directories = {};
  var isAlpha = {};
  var urls = {};
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
  DATA.directories = directories;
  DATA.alignment = sequences;


  // Load secondary structure alignment
  fetch("data/secondary.fasta").then(response => response.text()).then(text => loadSecondaryStructureAlignment(text, resolve));

  // Load all pdb files
  //fetch("data/structures.txt").then(response => response.text()).then(text => loadStructures(text, resolve));

}



function loadSecondaryStructureAlignment(fasta, resolve = function() { }){

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

  DATA.secondary = sequences;

  // All done
  resolve();

}


/*
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





// Recursively load a list of pdb structures in dssp
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


      //var acc = fileName.replace("data/dssp/", "").replace(".dssp", "");
      var acc_split = fileName.split("/");
      //acc = acc.replace("structures/", "");
      var acc = acc_split[acc_split.length -1];
      acc = acc.replace(".dssp", "");

      console.log(acc);

      // Put secondary stucture into alignment
      var sequence = "";
      var alignmentSequence = DATA.alignment[acc];
      var siteNum = 0;
      var nMissingRegions = 0; // Missing regions of pdb residues result in an addition line inserted, with symbol '!'
      for (var alnSiteNum = 0; alnSiteNum < alignmentSequence.length; alnSiteNum++){

        var alnChar = alignmentSequence[alnSiteNum];
        if (alnChar == "-"){

          sequence += "-";
        }else{


          var line = lines[firstLine + siteNum + nMissingRegions];
          var aa = line.substring(13, 14);
          while (aa == "!"){
            nMissingRegions ++;
            line = lines[firstLine + siteNum + nMissingRegions];
            aa = line.substring(13, 14);
          }
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


*/

// Draw a class I or II catalytic domain layout
function renderCatalyticDomainInserts(text, classNr){

	var json = null;
    //if (text == null || text == "") return;

	
	if (text != null && text != "" && text[0] != "<"){
    console.log(text);
		text = text.replaceAll("\n", "").replaceAll("\r", "");
		json = JSON.parse(text);
		console.log(json);
	}
   
	
	let className = classNr == 1 ? "I" : "II";

    // Prepare html and svg
    $("#tertiaryTable").after("<div id='catalyticDomainDIV'></div>");
    $("#catalyticDomainDIV").append("<h2>Catalytic domain</h1>")
    $("#catalyticDomainDIV").append("<ul class='flexContainer'></ul>");
    $("#catalyticDomainDIV .flexContainer").append(`<li>
                                                      <div>
														                            <div style='text-align:center'><b>Fig:</b> Map of the class ` + className + ` catalytic domain. Click on an element to select it. Figure is not to scale.</div>
                                                        <svg id='catalyticSVG' height=0 width=0 overflow='auto'></svg>
                                                      </div>
                                                    </li>`);
    


   

    // Populate the table
	if (json != null){
		
		$("#catalyticDomainDIV .flexContainer").append(`<li>
													<div class='svgDiv'>
													  <div style='text-align:center'><b>Table:</b> The size (aa) of each element in the catalytic domain relative to the <a href="../gly2">tetrameric GlyRS</a> reference sequence.</div>
													  <div style='overflow:auto;'>
							  <table class='maptable' id='catalyticTable'></table>
							</div>
												  </div>
												</li>`);


		// Header
		var tr = $("<tr></tr>")
		$(tr).append("<th class='accession'>Accession</th>");
		for (let eleNr = 0; eleNr < json.elements.length; eleNr++){
		  let ele = json.elements[eleNr];
		  let eleType = ele.substring(0, 1);
		  $(tr).append("<th ele='" + ele + "' type='" +eleType + "'>" + ele + "</th>");
		}
		$("#catalyticTable").append(tr);


		 // Body
		 for (var seqNum = 0; seqNum < json.accessions.length; seqNum++){
		  let acc = json.accessions[seqNum];
		  var accTidy = acc.replace(".pdb", "");
		  let trAcc = $("<tr></tr>")

		  // Reference sequence row?
		  let isRef = false;
		  if (acc == json.refSeq){
			  continue;
		  }
		  $(trAcc).append("<td class='accession'>" + accTidy + "</td>");
		  for (let eleNr = 0; eleNr < json.elements.length; eleNr++){
			let ele = json.elements[eleNr];
			let eleType = ele.substring(0, 1);
			var dlen = json[[acc + "_" + ele + ".dlength"]];
			if (dlen > 0) dlen = "+" + dlen;
			if (dlen == 0) dlen = "";
			$(trAcc).append("<td ele='" + ele + "' type='" +eleType + "'>" + dlen + "</td>");
		  }
		  $("#catalyticTable").append(trAcc);
		  
		 }
		  
		  // Ref seq at bottom
		  for (var seqNum = 0; seqNum < json.accessions.length; seqNum++){
			  
			let acc = json.accessions[seqNum];
			if (acc == json.refSeq){
				
				var accTidy = acc.replace(".pdb", "");
				let trAcc = $("<tr></tr>")
				$(trAcc).append("<td  class='accession'>" + accTidy + "</td>");
				trAcc.addClass("refSeq");
				trAcc.attr("title", "Reference structure");
				for (let eleNr = 0; eleNr < json.elements.length; eleNr++){
					let ele = json.elements[eleNr];
					let eleType = ele.substring(0, 1);
					var len = json[[acc + "_" + ele + ".length"]];
					$(trAcc).append("<td ele='" + ele + "' type='" + eleType + "'>" + len + "</td>");
				}
				$("#catalyticTable").append(trAcc);
			}
			


		}
		
		
	}


    // Populate the svg
    let svg = $("#catalyticSVG");
    svg.width(CATALYTIC_DOMAIN_WIDTH);
    svg.height(CATALYTIC_DOMAIN_HEIGHT);


    // Ele width and height
    let nElementsHorizontal = classNr == 1 ? 9 : 9;
    let nElementsVertical = 3;
    let eleWidth = (CATALYTIC_DOMAIN_WIDTH-CATALYTIC_DOMAIN_XPAD) / (nElementsHorizontal+1) - CATALYTIC_DOMAIN_XPAD;
    
	
	let helixCol  = AA_COLS_2["H"] + "99";
	let strandCol = AA_COLS_2["E"] + "99";


	if (classNr == 1){

	  // 5 parallel strands and 4 helices
      let odd = true;
	  let oddLoop = false;
      for (let i = 0; i <= 9 ; i++){
		  
		  
		let eleHeight = (CATALYTIC_DOMAIN_HEIGHT-4*CATALYTIC_DOMAIN_YPAD);
		let x = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*i;
	    let y = CATALYTIC_DOMAIN_YPAD*2;
		
		
		 // Loop
		if (i <= 9){
			let nr = i;
			if (i == 4) nr = 1;
			if (i == 3) nr = 2;
			if (i == 2) nr = 3;
			if (i == 1) nr = 4;
			if (i == 0) nr = 5;
			let eleName = "L" + nr;
			
			let xMid = x;
			let yLoop = y;
			let endPoint, control1, control2 = [];
			let ylab = y;
			let xlab = x;
			
			if (i == 5) oddLoop = !oddLoop;

			
			// N term
			if (i == 5){
				eleName = "N";
				yLoop = y+eleHeight;
				endPoint = [xMid, yLoop+3*CATALYTIC_DOMAIN_YPAD/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop+1*(CATALYTIC_DOMAIN_YPAD)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop+2*(CATALYTIC_DOMAIN_YPAD)/4];	
				xlab = xMid;
				ylab = yLoop+CATALYTIC_DOMAIN_YPAD + 5;
			}
			
			// C term
			else if (i == 9){
				eleName = "C";
				endPoint = [xMid, yLoop-3*CATALYTIC_DOMAIN_YPAD/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop-1*(CATALYTIC_DOMAIN_YPAD)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop-2*(CATALYTIC_DOMAIN_YPAD)/4];	
				xlab = xMid;
				ylab = yLoop-CATALYTIC_DOMAIN_YPAD - 5;
			}
			
			
			// Long loop between S3 and H3
			else if (i == 0){
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*1;
				endPoint = [CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*6, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-2.5*CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-2.5*CATALYTIC_DOMAIN_YPAD];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop-2*CATALYTIC_DOMAIN_YPAD+20;
				
				
				//yLoop = y+eleHeight;
				//endPoint = [CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*9, yLoop];
				//control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*CATALYTIC_DOMAIN_YPAD];
				//control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*CATALYTIC_DOMAIN_YPAD];	
				//ylab = yLoop+2*CATALYTIC_DOMAIN_YPAD-20;
				//xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				
			
			// Top loop
			}else if (oddLoop){
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_DOMAIN_YPAD];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop-CATALYTIC_DOMAIN_YPAD-3;
			}
			
			// Bottom loop
			else{
				yLoop = y+eleHeight;
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_DOMAIN_YPAD];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop+CATALYTIC_DOMAIN_YPAD+3;
			}
			
			
			
				
			let d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
			let group;
			if (eleName == "N" || eleName == "C"){
				group = $(drawSVGobj(svg, "g", {element: eleName, style:""} )); // No click events
			}else{
				group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
			}
			drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );
			drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:18px; text-anchor:middle; dominant-baseline:central; "}, eleName);

			if (i == 0) continue;
			oddLoop = !oddLoop;

		}
		
		
		let group;
		
		// Helix
		if (i % 2 == 0){
			
			
			let nr = i;
			if (i == 4) nr = 1;
			if (i == 2) nr = 2;
			if (i == 6) nr = 3;
			if (i == 8) nr = 4;
			var eleName = "H" + nr;
			
			group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
			let helixY = y;
			let eleHeightHelix = eleHeight;


			drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:1px; stroke:black; fill:white"} );
			drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:1px; stroke:black; fill:" + helixCol} );
			drawSVGobj(group, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:18px; text-anchor:middle; dominant-baseline:central; "}, eleName);
	

			
		}
		
		
		
		// Strand
		else if (i % 2 == 1){
			
		
			var y1, y2, y3;
			if (odd){

			  // Up arrow
			  y1 = y+eleHeight;
			  y2 = y+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  y3 = y+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  y4 = y;


			}else{

			  // Down arrow
			  y1 = y;
			  y2 = y+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  y3 = y+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  y4 = y+eleHeight;

			}

			var points =    (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
			points += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
			points += " " + (x-eleWidth/2) + "," + (y3);
			points += " " + x + "," + y4;
			points += " " + (x+eleWidth/2) + "," + (y3);
			points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
			points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);


		

			// Strand nr
			let nr = i;
			if (i == 5) nr = 1;
			if (i == 3) nr = 2;
			if (i == 1) nr = 3;
			if (i == 7) nr = 4;
			if (i == 9) nr = 5;
			var eleName = "S" + nr;

			group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:white"} )
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + strandCol} )
			drawSVGobj(group, "text", {x: x, y: y+eleHeight/2, style: "font-size:18px; text-anchor:middle; dominant-baseline:central; "}, eleName);
			
		
		}



		
		odd = !odd;
		  
		  
	  }


    }else if (classNr == 2){


      // 6 antiparallel strands and 3 helices
      let odd = false;
	  let oddLoop = false;
      for (let i = 0; i <= 9 ; i++){

		let eleHeight = (CATALYTIC_DOMAIN_HEIGHT-4*CATALYTIC_DOMAIN_YPAD);

        var x = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*i;
        var y = CATALYTIC_DOMAIN_YPAD*2;
		

		// Loop
		if (i <= 9){
			
			
			let nr = i;
			if (i == 5) nr = 8;
			if (i == 6) nr = 7;
			if (i == 7) nr = 6;
			if (i == 8) nr = 5;
			
			let eleName = "L" + nr;
			let xMid = x;
			let yLoop = y;
			

			let endPoint, control1, control2 = [];
			let ylab = y;
			let xlab = x;
			
			// N term
			if (i == 0){
				eleName = "N";
				yLoop = y+eleHeight;
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*1
				endPoint = [xMid, yLoop+3*CATALYTIC_DOMAIN_YPAD/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop+1*(CATALYTIC_DOMAIN_YPAD)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop+2*(CATALYTIC_DOMAIN_YPAD)/4];	
				xlab = xMid;
				ylab = yLoop+CATALYTIC_DOMAIN_YPAD + 5;
			}
			
			// C term
			else if (i == 9){
				eleName = "C";
				yLoop = y;
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*5
				endPoint = [xMid, yLoop-3*CATALYTIC_DOMAIN_YPAD/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop-1*(CATALYTIC_DOMAIN_YPAD)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop-2*(CATALYTIC_DOMAIN_YPAD)/4];	
				xlab = xMid;
				ylab = yLoop-CATALYTIC_DOMAIN_YPAD - 5;
				
			}
			
			// Long loop from S2 to H3
			else if (i == 4){
				yLoop = y+eleHeight;
				endPoint = [CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*9, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*CATALYTIC_DOMAIN_YPAD];	
				ylab = yLoop+2*CATALYTIC_DOMAIN_YPAD-20;
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				oddLoop = !oddLoop;
				
			}
			
			
			// Standard odd loop (top)
			else if (oddLoop){
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_DOMAIN_YPAD];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop-CATALYTIC_DOMAIN_YPAD-3;
			}
			
			// Standard even loop (bottom)
			else{
				yLoop = y+eleHeight;
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_DOMAIN_YPAD];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_DOMAIN_YPAD];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop+CATALYTIC_DOMAIN_YPAD+3;
			}
			
			
			
			let d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
			let group;
			if (eleName == "N" || eleName == "C"){
				group = $(drawSVGobj(svg, "g", {element: eleName, style:""} )); // No click events
			}else{
				group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
			}
			drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );
			drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:18px; text-anchor:middle; dominant-baseline:central; "}, eleName);
			
		
			
		}
	

    let group;
		
		
		// Helix
		if (i > 0 && i < 10 && (i <= 2 || i == 5 || i == 9)){
			
			
			let nr = i;
			if (i == 5) nr = 4;
			if (i == 9) nr = 3;
			var eleName = "H" + nr;

      // Special case: SH1
      if (i == 5){
        eleName = "SH1";
      }
			
			group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
			let helixY = y;
			let eleHeightHelix = eleHeight;
			
			// The final helix
			if (i == 5){
				eleHeightHelix = eleHeightHelix/2;
			}


			drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:1px; stroke:black; fill:white"} );
			drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:1px; stroke:black; fill:" + helixCol} );
			drawSVGobj(group, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:16px; text-anchor:middle; dominant-baseline:central; "}, eleName);
	

			
		}
		
		// Strand
		if (i > 2 && i < 9){
			
			// The final short strand
			if (i == 5){
				eleHeight = eleHeight/2;
				y = CATALYTIC_DOMAIN_YPAD*2 + eleHeight;
			}

			var y1, y2, y3;
			if (odd){

			  // Up arrow
			  y1 = y+eleHeight;
			  y2 = y+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  y3 = y+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  y4 = y;


			}else{

			  // Down arrow
			  y1 = y;
			  y2 = y+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  y3 = y+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  y4 = y+eleHeight;

			}

			var points =    (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
			points += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
			points += " " + (x-eleWidth/2) + "," + (y3);
			points += " " + x + "," + y4;
			points += " " + (x+eleWidth/2) + "," + (y3);
			points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
			points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);


		

			// Strand nr
			let nr = i-2;
			if (i == 6) nr = 5;
			if (i == 7) nr = 4;
			if (i == 8) nr = 3;
			var eleName = "S" + nr;



      // Special case: SH1 reuses the same group selector
      if (i == 5){
        group = group;
        eleName = "";
      }else{
        group = $(drawSVGobj(svg, "g", {element: eleName, style:"cursor:pointer"} ));
      }

			
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:white"} )
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + strandCol} )
			drawSVGobj(group, "text", {x: x, y: y+eleHeight/2, style: "font-size:18px; text-anchor:middle; dominant-baseline:central; "}, eleName);
			
		
		}

		
		
		oddLoop = !oddLoop;
		odd = !odd;
		

      }

    }
	
	
	svg.children("g").click(function(){
		
		let ele = $(this);
		var sse = $(ele).attr("element");
		if (sse == "N" || sse == "C") return;
		console.log( sse);
		
		$("#secondary").find(".selectionRect").remove();
		
		

		
		
		if ($(svg).children("g.selected").length > 0){
			$('table.maptable td').removeClass("selected");
			$('table.maptable th').removeClass("selected");
			$('table.maptable td').removeClass("deselected");
			$('table.maptable th').removeClass("deselected");
			$(svg).children("g").attr("class", "");
			
			// Clear selection
			SELECTED_SITES.lower = -1;
			SELECTED_SITES.upper = -1;
			selectSites();
			return;
		}
		
		$(svg).children("g").attr("class", "deselected");
		$('table.maptable td').removeClass("selected");
		$('table.maptable th').removeClass("selected");
		$('table.maptable td').addClass("deselected");
		$('table.maptable th').addClass("deselected");
		$('table.maptable td[ele="' + sse + '"]').removeClass("deselected");
		$('table.maptable th[ele="' + sse + '"]').removeClass("deselected");
		$('table.maptable td[ele="' + sse + '"]').addClass("selected");
		$('table.maptable th[ele="' + sse + '"]').addClass("selected");
		
		$(ele).attr("class", "selected");
		


		
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
