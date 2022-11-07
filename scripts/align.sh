#!/bin/sh

# sudo apt-get install dssp

cd data

rm -f structures.txt
touch structures.txt


rm -r -f dssp
mkdir -p dssp
for f in structures/*.pdb;
do

	echo $f
	echo $f >> structures.txt
	mkdssp -i $f -o $f.dssp
	mv $f.dssp dssp/.
	#../../../dssp2pdb.R  dssp/$f.dssp

done


#../../../../../DeepAlign/3DCOMB -i structures.txt -o align




# Features
rm -r -f domains
mkdir domains
Rscript ../../../scripts/mkdomains.R
cd domains


for d in *;
do
	echo "aligning feature: $d"
	cd $d
	rm -r -f dssp
	mkdir -p dssp

	rm -f structures.txt
	touch structures.txt

	for f in structures/*.pdb;
	do

		mkdssp -i $f -o $f.dssp
		mv $f.dssp dssp/.
		echo $f >> structures.txt

	done


	../../../../../../../DeepAlign/3DCOMB -i structures.txt -o align
	cd ../


done
