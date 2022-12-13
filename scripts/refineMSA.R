if (!requireNamespace("BiocManager", quietly=TRUE)) install.packages("BiocManager")
#BiocManager::install("msa")
library(msa)
library(seqinr)

MIN.SSE.LEN = 3
MAX.GAP.LEN = 10
MIN.REFINE.LEN = 4


# Refine a multiple sequence alignment using secondary structure information
args = commandArgs(trailingOnly=TRUE)


if (length(args) != 2){
	stop(paste("Use: Rscript refineMSA.R <primary.fasta> <secondary.fasta>"))
}



# Takes the average SSE at a position. Categorises into helix, strand, or unstructured
getSSEOfSite = function(siteNum, aln.2){
	chars = as.character(sapply(aln.2, function(x) x[siteNum]))
	chars = chars[chars != "-"]

	# Just 1 sequence? Treat as gap
	if (length(chars) < 2){
		return("-")
	}

	chars = sort(table(chars), decreasing=T)
	char = toupper(names(chars)[1])

	# Helix
	if (char == "G" | char == "I") {
		char = "H" 
	}

	# Unstructured
	if (char == "S" | char == "T" | char == "B") {
		char = "N" 
	}


	char

}


# Load alignments
aln.1 = read.fasta(file=args[1])
aln.2 = read.fasta(file=args[2])
nsites = length(aln.2[[1]])
if (length(aln.1[[1]]) != nsites){
	stop(paste("Mismatching site count", length(aln.1[[1]]), "!=", nsites))
}


# Find all regions of the alignment where there is extended secondary structure
sse.df = data.frame(element = character(0), start = numeric(0), stop = numeric(0))



prevSSE = getSSEOfSite(1, aln.2)
startsse = 1
for (i in 2:nsites){

	
	sse = getSSEOfSite(i, aln.2)


	
	if (sse != prevSSE){

		stopNr = i-1

		# Register as a structured sse if at minimum or above
		if (prevSSE == "E" | prevSSE == "H"){


			sse.len = stopNr - startsse + 1
			if (sse.len < MIN.SSE.LEN){

				# Too short. Set as unstructured
				prevSSE = "N"


				#cat(paste("Too short", stopNr, sse.len, "\n"))


			}
		}


		# Append with previous sse?
		if (nrow(sse.df) > 0 && sse.df[nrow(sse.df),"element"] == prevSSE){
			cat(paste("Appending", stopNr, "\n"))
			sse.df[nrow(sse.df),"stop"] = stopNr
		}else{
			sse.df2 = data.frame(element = prevSSE, start = startsse, stop = stopNr)
			sse.df = rbind(sse.df, sse.df2)
		}



		prevSSE = sse
		startsse = i
		
	}
	

}



# If there is a short gap between two identical elements, then join the three together
for (s in 1:nrow(sse.df)){


	c1 = ifelse(s == 1, NA, sse.df[s-1,"element"])
	c2 = sse.df[s,"element"]
	c3 = ifelse(s == nrow(sse.df), NA, sse.df[s+1,"element"])

	if (is.na(c2) | (is.na(c1) & is.na(c3))){
		next
	}

	c2.len = sse.df[s,"stop"] - sse.df[s,"start"] + 1
	if (c2.len > MAX.GAP.LEN){
		next
	}

	if (c2 == "-" && (c1 == c3 | is.na(c1) | is.na(c3)) ){


		ele = ifelse(is.na(c1), c3, c1)

		sse.df[s,"start"]
		start = ifelse(s == 1, sse.df[s,"start"], sse.df[s-1,"start"])
		stop = ifelse(s == nrow(sse.df), sse.df[s,"stop"], sse.df[s+1,"stop"])

		sse.df[s,"start"] = start
		sse.df[s,"stop"] = stop
		sse.df[s,"element"] = ele

		if (s > 1){
			sse.df[s-1,"start"] = start
			sse.df[s-1,"stop"] = stop
			sse.df[s-1,"element"] = NA



			for (ss in 1:(s-1)){
				if (sse.df[ss,"start"] == start){
					sse.df[ss,"element"] = NA
				}
			}

		}

		if (s < nrow(sse.df)){
			sse.df[s+1,"start"] = start
			sse.df[s+1,"stop"] = stop
			sse.df[s+1,"element"] = NA
		}
		

	}

}

sse.df = sse.df[!is.na(sse.df$element),]



# Realign all of the unstructured N regions
for (s in 1:nrow(sse.df)){



	c1 = sse.df[s,"element"]
	c1.len = sse.df[s,"stop"] - sse.df[s,"start"] + 1
	if (c1 != "N" | c1.len < MIN.REFINE.LEN){
		next
	}


	start = sse.df[s,"start"]
	stop = sse.df[s,"stop"]


	# Write to fasta and read it back in
	subseq = sapply(aln.1, function(seq) seq[start:stop])
	write("tmp.fasta", paste(paste0(">", names(subseq), "\n", as.character(subseq)), collapse="\n") )
	sequenceFile = system.file(".", "tmp.fasta", package="msa")
	file.in = readAAStringSet(sequenceFile)
	file.remove("tmp.fasta")



	# Realign



	# Compare scores



}

