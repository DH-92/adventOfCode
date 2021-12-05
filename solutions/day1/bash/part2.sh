#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-depths.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/1/input

ROLLING_WINDOW_SIZE=3;

previous_vars=()
position=0
tail_pos=0
increase_count=0
while IFS= read -r depth; do 
    (( position++ ))
    previous_vars[$position]=$depth
    # Do nothing until we're at least the window length deep
    (( position <= $ROLLING_WINDOW_SIZE )) && continue
    (( tail_pos++ ))
    tail=${previous_vars[$tail_pos]}
    (( depth > tail )) &&
        (( increase_count++ ))
done < "$INPUT_FILE_PATH"
echo "$increase_count"
