

// Adds a header to the top of the page and a footer to the bottom
function renderHeader(includeFooter = true){



  
  // Header, footer
  $("body").prepend("<div id='header'><span class='title'>URZYME.GITHUB.IO</span></div>")

  if (includeFooter){
    $("body").append("<div id='footer'></div>")
  }
  
  $("#header").append(`<div id='class2Selector' class='dropdown'>
						<button class='dropbtn'>Class II</button>
							<div class='dropdown-content'>
							</div>
						</button>
					   </div>`);
					   
	$("#header").append(`<div id='class1Selector' class='dropdown'>
						<button class='dropbtn'>Class I</button>
							<div class='dropdown-content'>
							</div>
						</button>
					   </div>`);		

	// Class 1
	$("#class1Selector div").append(`<a href='/class1/'><b>Home</b></a>`);
	$("#class1Selector div").append(`<a href='/class1/arg'>ArgRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/cys'>CysRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/gln'>GlnRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/glu1'>GluRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/glu2'>GlxRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/ile'>IleRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/leu'>LeuRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/lys'>LysRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/met'>MetRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/trp'>TrpRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/tyr'>TyrRS</a>`);
	$("#class1Selector div").append(`<a href='/class1/val'>ValRS</a>`);


	// Class 2
	$("#class2Selector div").append(`<a href='/class2/'><b>Home</b></a>`);
	$("#class2Selector div").append(`<a href='/class2/ala'>AlaRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/asn'>AsnRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/asp1'>AspRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/asp2'>AsxRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/gly1'>GlyRS (dimer)</a>`);
	$("#class2Selector div").append(`<a href='/class2/gly2'>GlyRS (tetramer)</a>`);
	$("#class2Selector div").append(`<a href='/class2/his'>HisRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/lys'>LysRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/phe1'>PheRS (bact &alpha;)</a>`);
	$("#class2Selector div").append(`<a href='/class2/phe2'>PheRS (bact &beta;)</a>`);
  $("#class2Selector div").append(`<a href='/class2/phe3'>PheRS (euk &alpha;)</a>`);
  $("#class2Selector div").append(`<a href='/class2/phe4'>PheRS (euk &beta;)</a>`);
	$("#class2Selector div").append(`<a href='/class2/phe5'>PheRS (mito)</a>`);
	$("#class2Selector div").append(`<a href='/class2/pro'>ProRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/pyl'>PylRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/sep'>SepRS</a>`);
	$("#class2Selector div").append(`<a href='/class2/ser1'>SerRS (standard)</a>`);
	$("#class2Selector div").append(`<a href='/class2/ser2'>SerRS (Archaeal)</a>`);
	$("#class2Selector div").append(`<a href='/class2/thr'>ThrRS</a>`);


}


