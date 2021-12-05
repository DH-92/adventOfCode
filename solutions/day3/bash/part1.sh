#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-rates.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/3/input

positions_summed=()
number_count=0
while IFS= read -r number; do
    number_len="${#number}"
    (( number_len-- )) #stops the loop going from 0 to 12
    number_rev=$(echo $number | rev) #work with LSB first
    for ii in $(seq 0 "$number_len"); do
        [[ "${number_rev:ii:1}" == 1 ]] && (( positions_summed[ii]++ ))
    done
    (( number_count++ ))
done < "$INPUT_FILE_PATH"
gamma=0
epsilon=0
for ii in $(seq 0 "$number_len") ; do
    if (( positions_summed[ii]*2 >= number_count )); then
        (( gamma+= 2**ii )) 
    else
        (( epsilon+= 2**ii )) 
    fi
done
echo $(( gamma * epsilon ))
