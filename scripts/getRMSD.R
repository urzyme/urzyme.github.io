


# Read in deepalign output and extract rmsd. Append to output file


args = commandArgs(trailingOnly=TRUE)


score = readLines(args[1])
structure1 = args[2]
structure2 = args[3]
output.file = args[4]



rmsd = as.numeric(strsplit(strsplit(score[2], "->")[[1]][3], " +")[[1]][3])
tm = as.numeric(strsplit(strsplit(score[2], "->")[[1]][3], " +")[[1]][4])


write(paste0(structure1, ",", structure2, ",", rmsd, ",", tm), output.file, append=T)