# Equestria Lossless Audio Codec
An entirely open-source lightweight lossless audio codec/container.

> WebKit/Safari doesn't support playing audio from a Blob, a required feature to play ELAC files in a browser; therefore playing ELAC files in Safari is not supported.

## Why use ELAC?
* ELAC is free, libre and open-source software
* It is lighter than FLAC, WAV, or MP3 with the same quality
* A single file can contain multiple tracks that will be played after each other (if using a supported player, e.g. `elac-play`)
* ELAC keeps all metadata from your original file (except album art)

## ELAC-EL vs ELAC-PL
ELAC-EL (Emulated Lossless) files are created when a non-lossless file is given to `elac-encode` (e.g. MP3, OGG, ...), they usually have small file size and are playable everywhere.

ELAC-PL (Physical Lossless) files are created when a lossless file is given to `elac-encode` (e.g. WAV, FLAC, ...).

Both ELAC-EL and ELAC-PL usually have smaller size than the original files.