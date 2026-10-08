Add-Type -AssemblyName System.Drawing
$S = 256
$bmp = New-Object System.Drawing.Bitmap $S, $S
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::Transparent)

function RoundRect($x, $y, $w, $h, $r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

# background tile: deep navy -> violet
$bg = RoundRect 8 8 240 240 56
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush ([System.Drawing.Point]::new(0,0)), ([System.Drawing.Point]::new(256,256)), ([System.Drawing.Color]::FromArgb(255,14,12,40)), ([System.Drawing.Color]::FromArgb(255,70,20,120))
$g.FillPath($brush, $bg)

# back "ghost" window (faded, offset)
$back = RoundRect 40 40 140 100 16
$g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70,0,229,255))), $back)

# front floating window with neon outline
$front = RoundRect 76 100 150 110 18
$g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235,10,10,24))), $front)
$neon = New-Object System.Drawing.Drawing2D.LinearGradientBrush ([System.Drawing.Point]::new(76,100)), ([System.Drawing.Point]::new(226,210)), ([System.Drawing.Color]::FromArgb(255,0,229,255)), ([System.Drawing.Color]::FromArgb(255,255,60,200))
$pen = New-Object System.Drawing.Pen $neon, 7
$g.DrawPath($pen, $front)

# title strip dots
foreach ($i in 0..2) {
  $c = @([System.Drawing.Color]::FromArgb(255,255,95,110), [System.Drawing.Color]::FromArgb(255,255,200,60), [System.Drawing.Color]::FromArgb(255,60,230,140))[$i]
  $g.FillEllipse((New-Object System.Drawing.SolidBrush $c), (94 + $i * 18), 114, 11, 11)
}

# play triangle
$tri = [System.Drawing.Point[]]@([System.Drawing.Point]::new(138,142), [System.Drawing.Point]::new(138,190), [System.Drawing.Point]::new(180,166))
$g.FillPolygon($neon, $tri)

$g.Dispose()
$png = Join-Path $PSScriptRoot 'icon.png'
$bmp.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# wrap the PNG in a single-image ICO
$pngBytes = [System.IO.File]::ReadAllBytes($png)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $ms
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]1)
$bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$pngBytes.Length); $bw.Write([uint32]22)
$bw.Write($pngBytes)
[System.IO.File]::WriteAllBytes((Join-Path $PSScriptRoot 'icon.ico'), $ms.ToArray())
