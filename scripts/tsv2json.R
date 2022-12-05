library(rjson)


args = commandArgs(trailingOnly=TRUE)

if (length(args) != 2){
	stop("Use: Rscript tsv2json.R <file.tsv> <idCol>")
}

in.df = read.table(args[1], sep="\t", header=T)
idCol = args[2]
if (!any(colnames(in.df) == idCol)){
	stop(paste("Cannot find column", idCol))
}


JSON = list()
for (id in in.df[,idCol]){

	JSON[[id]] = in.df[in.df[,idCol] == id,]


}


exportJSON <- toJSON(JSON, indent=4)
outfile = gsub("[.]tsv", ".json", args[1])
if (outfile == args[1]){
	outfile = paste0(args[1], ".json")
}
cat(paste("Saving to", outfile, "\n"))
write(exportJSON, outfile)

