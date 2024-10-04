""" sendsnip
function! s:get_visual_selection() range
    let [line_start, column_start] = getpos("'<")[1:2]
    let [line_end, column_end] = getpos("'>")[1:2]
    let lines = getline(line_start, line_end)
    if len(lines) == 0
        return ''
    endif
    let lines[-1] = lines[-1][: column_end - (&selection == 'inclusive' ? 1 : 2)]
    let lines[0] = lines[0][column_start - 1:]
    return join(lines, "\n")
endfunction

function! s:post_snippet() range
    let url = 'https://pi.danrh.net/snippets'
    let data = s:get_visual_selection()
    let command = 'curl -H "content-type: text/plain" -H "authorization: Bearer <add-apikey-here>" -X POST -d ' . shellescape(data) . ' ' . shellescape(url) . ' 2>/dev/null'
    let response = system(command)
endfunction

command! -range PostSnippet '<,'> call s:post_snippet()

noremap <leader>p :PostSnippet<CR>
