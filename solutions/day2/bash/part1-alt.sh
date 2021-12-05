#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-depths.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/1/input

total_forward=$(grep "forward" "$INPUT_FILE_PATH" | awk '{forward+=$2} END {print forward}')
total_up=$(grep "up" "$INPUT_FILE_PATH"  | awk '{up+=$2} END {print up}')
total_down=$(grep "down" "$INPUT_FILE_PATH" | awk '{down+=$2} END {print down}')
echo $(( total_down - total_up * total_forward ))
