library(seqinr)


# Make truncated domain files
features.df = read.table("features.tsv", sep="\t", header=F, comment="#")
colnames(features.df) = c("domain", "range", "level")


# All structures
pdbFiles = readLines("structures.txt")

# Fasta
fasta = read.fasta(file="align.ali")



nsites = length(fasta[[1]])
for (domain in features.df$domain){

	if (domain == ""){
		next
	}

	domainRange = features.df[features.df$domain == domain, "range"]
	level = features.df[features.df$domain == domain, "level"]
	if (level <= 1){
		next
	}


	cat(paste(domain, "\n"))


	
	
	if (length(strsplit(domainRange, "-")[[1]]) == 1){
		next
	}
	domainRange = as.numeric(strsplit(domainRange, "-")[[1]])
	domainRange = domainRange[1]:domainRange[2]


	if (!dir.exists("domains/")){
		dir.create("domains/")
	}

	dirName = paste0("domains/", gsub(" ", "_", domain))
	if (!dir.exists(dirName)){
		dir.create(dirName)
	}
	
	dirName2 = paste0(dirName, "/structures")
	if (!dir.exists(dirName2)){
		dir.create(dirName2)
	}


	for (pdbFile in pdbFiles){

		#cat(paste(pdbFile, "\n"))

		pdb = readLines(pdbFile)

		# Load a pdb file
		atomLines = grep("^ATOM", pdb)
		atoms = pdb[atomLines]



		pdb.df = data.frame(line = atomLines, chain = substr(atoms, 22, 22), residue = substr(atoms, 18, 20), pos.pdb = as.numeric(substr(atoms, 24, 26)), include = TRUE)
		pdb.df2 = pdb.df[pdb.df$chain == "A",]
		if (nrow(pdb.df2) == 0){
			pdb.df2 = pdb.df[pdb.df$chain == "B",]
		}
		if (nrow(pdb.df2) == 0){
			cat(paste("Skipping", pdbFile, "\n"))
			next
		}
		pdb.df = pdb.df2

		# Find matching sequence
		seq = fasta[[pdbFile]]
		pdb.site.nums = unique(pdb.df$pos.pdb)

		s=1
		for (site in 1:nsites){


			
			targetChar = seq[site]
			if (targetChar == "-"){



			}else{


				pdbTargetSite = pdb.site.nums[s]
				if (is.na(pdbTargetSite)){
					next
				}

				#print(paste(s, site, pdbTargetSite, length(pdb.site.nums)))

				# Keep the site if in range
				chars.ref = as.character(sapply(names(fasta), function(n) fasta[[n]][site] ))
				if (any(site == domainRange)){

					# Keep this residue
					pdb.df[pdb.df$pos.pdb == pdbTargetSite,"include"] = TRUE

				}else{

					# Discard this residue
					pdb.df[pdb.df$pos.pdb == pdbTargetSite,"include"] = FALSE

				}

				s = s + 1

			}




		}



		nres = unique(pdb.df[pdb.df$include,"pos.pdb"])
		if (length(nres) < 12){
			cat(paste(pdbFile, "DOES NOT HAVE", domain, "\n"))
			next
		}

		atomLinesInclude = pdb.df[pdb.df$include,"line"]
		cat(paste(pdbFile, "HAS", domain, "\n"))




		# Write target structure to file
		pdb.lines = numeric(0)
		if (atomLines[1] > 1){
			pdb.lines = 1:(atomLines[1]-1)
		}
		pdb.lines = c(pdb.lines, atomLinesInclude)
		if (atomLines[length(atomLines)] < length(pdb)){
			pdb.lines = c(pdb.lines, atomLines[(length(atomLines)+1):length(pdb)])
		}
		pdb.truncated = pdb[pdb.lines]


		# Remove secondary structure
		sse = grep("^(HELIX|SHEET)", pdb.truncated)
		if (length(sse) > 0){
			pdb.truncated = pdb.truncated[-sse]
		}


		file.name = gsub(".+/", "", pdbFile)
		write(paste(pdb.truncated, collapse="\n"), paste0(dirName2, "/", file.name))







	}


}