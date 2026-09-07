import subprocess
import os

os.makedirs("tmp_video", exist_ok=True)

# We already have tmp_video/shot1.mp4, shot2.mp4, shot3.mp4
# Let's extract first 2 seconds of shot1 to use as loop closing transition
cmd_shot1_head = [
    "ffmpeg", "-y", "-i", "tmp_video/shot1.mp4",
    "-t", "2.5", "-c", "copy", "tmp_video/shot1_head.mp4"
]
subprocess.run(cmd_shot1_head, check=True)

# Combine:
# [0:v][1:v] xfade at 4.5s (1.5s duration) -> v01
# [v01][2:v] xfade at 9.0s (1.5s duration) -> v02
# [v02][3:v] xfade at 13.5s (1.5s duration) -> vfinal
# vfinal ends at 13.5 + 2.5 = 16.0s. At 15.0s it has completely crossfaded to shot1's start!
# Then trim to exactly 15.0s so loop is 100% seamless!
cmd_seamless = [
    "ffmpeg", "-y",
    "-i", "tmp_video/shot1.mp4",
    "-i", "tmp_video/shot2.mp4",
    "-i", "tmp_video/shot3.mp4",
    "-i", "tmp_video/shot1_head.mp4",
    "-filter_complex",
    "[0:v][1:v]xfade=transition=fade:duration=1.5:offset=4.5[v01];"
    "[v01][2:v]xfade=transition=fade:duration=1.5:offset=9.0[v02];"
    "[v02][3:v]xfade=transition=fade:duration=1.5:offset=13.5[v03];"
    "[v03]trim=0:15,setpts=PTS-STARTPTS[vfinal]",
    "-map", "[vfinal]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "public/videos/golf-hero.mp4"
]

print("Rendering seamless loop MP4...")
subprocess.run(cmd_seamless, check=True)

# Extract high quality poster
cmd_poster = [
    "ffmpeg", "-y",
    "-ss", "00:00:01.000",
    "-i", "public/videos/golf-hero.mp4",
    "-vframes", "1",
    "-q:v", "2",
    "public/videos/golf-hero-poster.jpg"
]
print("Extracting poster...")
subprocess.run(cmd_poster, check=True)

# Convert to WebM using VP9 fast
cmd_webm = [
    "ffmpeg", "-y",
    "-i", "public/videos/golf-hero.mp4",
    "-c:v", "libvpx-vp9", "-b:v", "1800k", "-crf", "30", "-speed", "4", "-threads", "4",
    "-pix_fmt", "yuv420p",
    "public/videos/golf-hero.webm"
]
print("Rendering WebM...")
subprocess.run(cmd_webm, check=True)

print("SUCCESSFULLY GENERATED SUNRISE GREENKEEPER DRONE VIDEO LOOP!")
