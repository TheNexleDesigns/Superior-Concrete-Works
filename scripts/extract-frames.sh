#!/usr/bin/env bash
# Rebuild the scroll-animation frames from a new source video.
# Usage: bash scripts/extract-frames.sh path/to/mold-video.mp4
# Needs ffmpeg. Trims 0.5s off the start, keeps 9s, 12 frames per second (108 frames).
# The mobile set is a centre 9:16 crop, so the subject must sit in the middle third of the frame.
set -euo pipefail
SRC="${1:?Give the path to the source video}"
OUT="public/scrub"
rm -rf "$OUT/desk" "$OUT/mob"; mkdir -p "$OUT/desk" "$OUT/mob"
ffmpeg -v error -y -ss 0.5 -t 9 -i "$SRC" -vf "fps=12,scale=1280:-2" -c:v libwebp -quality 76 -compression_level 6 "$OUT/desk/f_%03d.webp"
ffmpeg -v error -y -ss 0.5 -t 9 -i "$SRC" -vf "fps=12,crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=-2:720" -c:v libwebp -quality 76 -compression_level 6 "$OUT/mob/f_%03d.webp"
echo "Desktop frames: $(ls $OUT/desk | wc -l)  Mobile frames: $(ls $OUT/mob | wc -l)"
echo "If the frame count is not 108, update FRAME_COUNT in src/components/MoldScrub.tsx."
