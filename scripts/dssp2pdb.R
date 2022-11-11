library(stringr)


# Read dssp
args = commandArgs(trailingOnly=TRUE)

dssp = readLines(args[1])
pdb = readLines(args[2])
start = grep("#  RESIDUE AA STRUCTURE", dssp) + 1

if (length(grep("^HELIX", pdb) > 0)){
	# skip

	out.file = gsub("[.]dssp", ".pdb", args[1])
	out.file = gsub("[.]pdb[.]pdb", ".pdb", out.file)
	write(pdb, out.file)
	stop(paste("Do not need to produce sse for", args[2]))
}



# 

# Get secondary structural elements
sse.df = data.frame(start = numeric(0), stop = numeric(0), sse = character(0))
prevSSE =  substr(dssp[start], 17, 17)
startsse = as.numeric(substr(dssp[start], 8, 10))
for (i in (start+1):length(dssp)){

	line = dssp[i]
	if (line == ""){
		next
	}

	res = substr(line, 14, 14)
	if (res == "!"){
		next;
	}
	
	
	sse = substr(line, 17, 17)
	
	if (sse != prevSSE){

		stopNr = as.numeric(substr(dssp[i-1], 8, 10))
		sse.df2 = data.frame(start = startsse, stop = stopNr, sse = prevSSE)
		sse.df = rbind(sse.df, sse.df2)


		prevSSE = sse
		startsse = as.numeric(substr(dssp[i], 8, 10))
		
	}
	

}


sse.out = character(0)
helixNr = 1
sheetNr = 1
for (i in 1:nrow(sse.df)){


	sse = sse.df[i,"sse"]
	res1 = sse.df[i,"start"]
	res2 = sse.df[i,"stop"]

	# Helix
	# http://www.bmsc.washington.edu/CrystaLinks/man/pdb/part_42.html
	if (sse == "H" | sse == "I" | sse == "G"){
		line = "HELIX  " # Column 1-6
		line = paste0(line, str_pad(helixNr, 3, side = "left", pad = " ")) # Column 8-10
		#line = paste0(line, " ") # Column 11 spacing
		line = paste0(line, str_pad(paste0("A", helixNr), 4, side = "left", pad = " ")) # Column 12-14
		line = paste0(line, " ") # Column 15 spacing
		line = paste0(line, "XXX ") # Column 16-19: residue name
		line = paste0(line, "A ") # Column 20-21: chain name
		line = paste0(line, str_pad(res1, 4, side = "left", pad = " ")) # Column 22-25: start residue
		line = paste0(line, "  ") # Column 26-27 spacing
		line = paste0(line, "XXX ") # Column 28-31: residue name
		line = paste0(line, "A ") # Column 32-33: chain name
		line = paste0(line, str_pad(res2, 4, side = "left", pad = " ")) # Column 34-37: end residue
		line = paste0(line, "  ") # Column 38 spacing
		line = paste0(line, "1 ") # Column 39-40: helix code. TODO use other classes
		line = paste0(line, "                              ") # Column 41-71 spacing
		line = paste0(line, str_pad(res2-res1+1, 5, side = "left", pad = " ")) # Column 72-76: helix length

		# HELIX    1  A1 XXX A    1  XXX A   10  1                                  10
		sse.out = c(sse.out, line)
		  
		helixNr = helixNr + 1
	}


}


pdb.out = c(paste0(sse.out, collapse = "\n"), paste0(pdb, collapse = "\n"), collapse = "\n")


out.file = gsub("[.]dssp", ".pdb", args[1])
out.file = gsub("[.]pdb[.]pdb", ".pdb", out.file)
write(pdb.out, out.file)