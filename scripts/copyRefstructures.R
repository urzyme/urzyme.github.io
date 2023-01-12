library(rjson)



# Put the directory of all reference structures into the output file eg. structures.txt 


args = commandArgs(trailingOnly=TRUE)
wd = args[1]
domain = args[2]
outfile = args[3]
outfileJSON = args[4]
classNr = args[5]


classNr = as.numeric(gsub("[a-z]", "", tolower(classNr)))
classNr = ifelse(classNr == 1, "Class I", "Class II")


output = character(0)

dirs = list.dirs(wd, recursive=F)
for (d in dirs){

	json = fromJSON(file = paste0(d, "/info.json"))
	ref_str = json$ref_str


	# Does the domain exist?
	domainDir = paste0(d, "/data/domains/", domain)
	if (dir.exists(domainDir)){

		fileDir = paste0(domainDir, "/", ref_str)

		if (file.exists(fileDir)){

			output = c(output, fileDir)
		}else{
			cat(paste0("Warning cannot find", fileDir, "\n"))
		}

		

	}else{
		cat(paste0("Warning cannot find", domainDir, "\n"))
	}

	

}


write(paste(output, collapse="\n"), outfile)


# Output json file
domainNameTidy = gsub("_", " ", domain)
JSON = list()
JSON[["fullName"]] = paste0(classNr, " ", domainNameTidy)
JSON[["class"]] = classNr
JSON[["icon"]] = "/fig/icon_white.png"
JSON[["description"]] = paste0("Structural alignment of the ", classNr, " superfamily's ", tolower(domainNameTidy), ".")



exportJSON <- toJSON(JSON, indent=4)
cat(paste("Saving json to", outfile, "\n"))
write(exportJSON, outfileJSON)




