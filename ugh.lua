function openfile_with_lua()

end

local M = {}

M.run = function()
    local ts_buff = vim.api.nvim_create_buf(false, false)
    M.bufnr = ts_buff
    -- Set the buffer name
    vim.api.nvim_buf_set_name(ts_buff, 'test2.ts')
    -- Open the buffer in a new window
    vim.api.nvim_set_current_buf(ts_buff)

    -- Insert text into the buffer
    local lines = {
        "console.log('Hello, World!)",
    }
    -- Corrected line: Replace all lines (from line 0 to the end)
    vim.api.nvim_buf_set_lines(ts_buff, 0, -1, false, lines)
    vim.api.nvim_command('wq!')
end













function run()
    local function check_server()
        return vim.lsp.buf.server_ready()
    end

    vim.schedule(function()
        vim.api.nvim_win_set_buf(0, M.bufnr)

        local diagnostics = vim.diagnostic.get()
        for _, diagnostic in ipairs(diagnostics) do
            print(vim.inspect(diagnostic))
        end
    end)
end

M.run()
run()
