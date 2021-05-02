cairo-compile "$1.cairo" --output "$1_compiled.json"
cairo-run --program="$1_compiled.json" \
  --print_output --print_info --print_memory --relocate_prints --layout=small --debug_error \
  --program_input="$1_input".json 

