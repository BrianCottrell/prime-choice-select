%builtins output range_check

from starkware.cairo.common.serialize import serialize_word, serialize_array
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_lt


struct Token:
    # The value of the node.
    member symbol : felt

    # The number of elements in the stack.
    member fee : felt # in WEI / GWEI

    member speed : felt # instant, fast, standard
end

func get_at(tokens : Token*, index : felt) -> (token : Token*):
    return (token=tokens+index)
end

# func find_best_token{range_check_ptr}(tokens : Token*, n : felt) -> (token : Token*):
#     if n == 0:
#         # When 0 is reached, return 0.
#         return (token=best_token)
#     else:
#         if n == 1:
#             return (token=tokens+0)
#         end
#     end

#     let next_token = tokens+Token.SIZE
#     let (token) = find_best_token(tokens=next_token, n=n-1, best_token=best_token)

#     tempvar current_fee = token.fee
#     tempvar lowest_fee = best_token.fee
#     assert_lt(a=current_fee, b=lowest_fee)

#     return (token=best_token)
# end

func main{output_ptr : felt*, range_check_ptr}():
    alloc_locals  
    # let (local best_token : Token*) = alloc()
    local n : felt
    local idx : felt
    local min_speed : felt # 1,2,3
    let (token_list : Token*) = alloc()

    %{
        # The verifier doesn't care where those lists are
        # allocated or what values they contain, so we use a hint
        # to populate them.
        tokens = program_input['tokens']
        min_speed = program_input['min_speed']
        ids.min_speed = min_speed

        # https://www.cairo-lang.org/docs/hello_cairo/voting.html#processing-the-program-input
        ids.n = len(tokens)
        min_val = 'NaN'
        min_index = -1
        for i, val in enumerate(tokens):
            base_addr = ids.token_list.address_ + ids.Token.SIZE * i
            memory[base_addr + ids.Token.symbol] = int(val['symbol'], 16)
            memory[base_addr + ids.Token.fee] = val['fee']
            memory[base_addr + ids.Token.speed] = val['speed']
            if (min_val == 'NaN' or val['fee'] < min_val) and val['speed'] >= min_speed:
                min_val = val['fee']
                min_index = i
        ids.idx = min_index
    %}

    serialize_word(idx)

    # We should have a valid index if there is an acceptable protocol.
    assert_lt(a=idx, b=n) 

    let (res) = get_at(tokens=token_list, index=idx)

    # Output the result.
    serialize_word(res.symbol)
    serialize_word(res.fee)
    serialize_word(res.speed)
    # end
    return ()
end