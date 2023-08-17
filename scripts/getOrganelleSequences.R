library(seqinr)


PLANT_PHYLA = c("Streptophyta", "Chlorophyta", "Rhodophyta", "Euglenozoa")

# Iterate through all fasta files and put the non-plant eukaryotic/organelle sequences into mito.fasta, and the plant ones into chloro.fasta
mito = character(0)
chloro = character(0)


# Load metadata
metadata.df = read.table("data/accessions.tsv", sep="\t", header=T, quote="`")

classes = c("class1", "class2")
for (cla in classes){

	
	dirs = list.dirs(cla, recursive=F)
	for (d in dirs){
	
	
		# Read fasta
		fasta = read.fasta(paste0(d, "/data/align.ali"))
		names(fasta) = gsub(".+/", "", names(fasta))
		names(fasta) = gsub("[.]pdb", "", names(fasta))
		for (acc in names(fasta)){
		
			# Find metadata for sequence
			match = which(metadata.df$accession == acc)
			if (length(match) > 0){
				match = match[1]
				
				
				# Is it eukaryotic?
				domain = metadata.df[match,"domain"]
				phylum = metadata.df[match,"phylum"]
				if (domain == "Eukaryota" | domain == "Mitochondrial"){
				
					sequence = toupper(gsub("-", "", paste0(as.character(fasta[[acc]]), collapse="")))
					names(sequence) = acc
					
					# Is it a plant?
					if (any(tolower(phylum) == tolower(PLANT_PHYLA))){
						chloro = c(chloro, sequence)
					
					}else{
						mito = c(mito, sequence)
					
					}

				
				}
				
			}else{
				cat(paste0("Warning: cannot find", acc, "\n"))
			}
			
		}
		
		
	
	}

}


write.fasta(lapply(chloro, function(ele) ele), names=names(chloro), file.out="data/chloro.fasta") 
write.fasta(lapply(mito, function(ele) ele), names=names(mito), file.out="data/mito.fasta") 



