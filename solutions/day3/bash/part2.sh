#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-rates.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/3/input

cat $INPUT_FILE_PATH | sort > tmp
line_count=$(cat $INPUT_FILE_PATH | wc -l)
oo=""
coo=""

binary_to_decimal() {
    local decimal=0
    local r_binary=$(echo "$1" | rev)
    for ii in $(seq 0 "${#r_binary}") ; do
        [[ ${r_binary:ii:1} == 1 ]] && (( decimal+= 2**ii ))
    done
    echo $decimal; return
}

for run in "oo" "coo"; do
    mask=""
    low_bound=0
    high_bound=$line_count
    remaining=$line_count
    while (( remaining > 1 )); do
        test_result=$(
            cat tmp |
            head -n ${high_bound} |
            tail -n +${low_bound} |
            grep -c "^${mask}0"
        )
        if ( 
            [[ "$run" == "oo" ]] && (( test_result*2 > remaining )) 
           ) || (
            [[ "$run" == "coo" ]] && (( test_result*2 <= remaining )) 
           ); then
            mask+="0";
            remaining=$test_result;
            high_bound=$(( low_bound + remaining - 1))
        else
            mask+="1";
            remaining=$(( remaining - test_result ))
            low_bound=$(( high_bound - remaining + 1))
        fi
    done
    result_binary=$(grep "^$mask" tmp)
    decimal=$(binary_to_decimal $result_binary)
    [[ "$run" == "oo" ]] && oo=$decimal || coo=$decimal
done
rm tmp
echo $(( oo * coo ))
exit
