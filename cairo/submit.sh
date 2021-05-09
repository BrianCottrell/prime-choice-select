cairo-compile "$1.cairo" --output "$1_compiled.json"
cairo-sharp submit --source "$1".cairo \
    --program_input "$1_input".json

