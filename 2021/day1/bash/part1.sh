#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-depths.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/1/input

increase_count=0
previous=-1
while IFS= read -r depth; do 
	(( previous > 0  && depth > previous )) &&
		(( increase_count++ ))
	previous=$depth
done < "$INPUT_FILE_PATH"
echo "$increase_count"
