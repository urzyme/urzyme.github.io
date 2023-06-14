#!/bin/sh



# Calculate the pairwise RMSD between all possible combinations of sructures and save the numbers to a text file
for c in class*;
do

	echo $c
	cd $c
	for a in */;
	do

		cd $a/data/domains/Catalytic_domain
		echo $a


		echo "str1,str2,rmsd,tm" > rmsd.csv

		mkdir -p tmp
		cd tmp

		


		file_list="../structures.txt"

		# Loop through each file in the list
		i=0
		while read file1; do
		    # Loop through each file again, starting from the next file
		    j=0
		    while read file2; do
		        # Check if the two files are different and i < j
		        if [ "$i" -lt "$j" ] && [ "$file1" != "$file2" ]; then


		        	echo "Aligning ../$file1 ../$file2"

		            # Run the DeepAlign command on the two files
		            ~/DeepAlign/DeepAlign "../$file1" "../$file2" -o alignment 

		            Rscript ../../../../../../scripts/getRMSD.R alignment.score $file1 $file2 ../rmsd.csv

		        fi
		        ((j++))
		    done < "$file_list"
		    ((i++))
		done < "$file_list"

		

		cd ../
		rm -r tmp


		cd ../../../../


	done
	cd ../


done




