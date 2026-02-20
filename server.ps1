# Tiny HTTP server — built-in Windows PowerShell, no install needed
$port = 8765
$dir  = $PSScriptRoot

$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath.TrimStart('/')
    if (!$path) { $path = 'index.html' }

    $file = Join-Path $dir $path
    if (Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ctx.Response.ContentLength64 = $bytes.Length
        if ($file -match '\.html$') { $ctx.Response.ContentType = 'text/html; charset=utf-8' }
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
