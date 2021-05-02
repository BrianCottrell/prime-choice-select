%builtins output

from starkware.cairo.common.serialize import serialize_word
from starkware.cairo.common.alloc import alloc


struct Token:
    # The value of the node.
    member symbol : felt

    # The number of elements in the stack.
    member fee : felt # in WEI / GWEI

    member speed : felt # instant, fast, standard
end

func find_best_token(tokens : Token*, n : felt, best_token : Token*) -> (token : Token*):
    if n == 0:
        # When 0 is reached, return 0.
        return (token=best_token)
    end

    let (token) = find_best_token(tokens=tokens+Token.SIZE, n=n-1, best_token=best_token)

    tempvar current_fee = token.fee
    # tempvar lowest_fee = best_token.fee

    if current_fee <= 0:
        let best_token = token
    end

    return (token=best_token)
end

func main{output_ptr : felt*}():
    alloc_locals  
    let best_token : Token* = alloc()
    local n : felt
    let (token_list : Token*) = alloc()

    %{
        # The verifier doesn't care where those lists are
        # allocated or what values they contain, so we use a hint
        # to populate them.
        tokens = program_input['tokens']

        # https://www.cairo-lang.org/docs/hello_cairo/voting.html#processing-the-program-input
        ids.n = len(tokens)
        for i, val in enumerate(tokens):
            base_addr = ids.token_list.address_ + ids.Token.SIZE * i
            memory[base_addr + ids.Token.symbol] = int(val['symbol'], 16)
            memory[base_addr + ids.Token.fee] = val['fee']
            memory[base_addr + ids.Token.speed] = val['speed']
    %}

    let (res) = find_best_token(tokens=token_list, n=n, best_token=best_token)

    # Output the result.
    serialize_word(res.symbol)
    return ()
end