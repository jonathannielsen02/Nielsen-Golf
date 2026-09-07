import subprocess
import os

IMG1 = "src/assets/images/drone_sunrise_greenkeeper_1788823014012.jpg"
IMG2 = "src/assets/images/greenkeeper_mowing_sunrise_1788823032815.jpg"
IMG3 = "src/assets/images/course_prep_dawn_1788823045653.jpg"

os.makedirs("tmp_video", exist_ok=True)

# Generate Shot 1: Gentle drone forward glide and slow rise over the fairway
cmd1 = [
    "ffmpeg", "-y", "-loop", "1", "-i", IMG1,
    "-vf", "scale=3840:2160,zoompan=z='min(zoom+0.0008,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+on*0.2':d=180:s=1920x1080:fps=30",
    "-t", "6", "-c:v", "libx264", "-pix_fmt", "yuv420p", "tmp_video/shot1.mp4"
]

# Generate Shot 2: Slow panning drone shot across greenkeeper mower
cmd2 = [
    "ffmpeg", "-y", "-loop", "1", "-i", IMG2,
    "-vf", "scale=3840:2160,zoompan=z='min(1.05+0.0006*on,1.3)':x='(iw-iw/zoom)*0.3+on*0.4':y='(ih-ih/zoom)*0.5':d=180:s=1920x1080:fps=30",
    "-t", "6", "-c:v", "libx264", "-pix_fmt", "yuv420p", "tmp_video/shot2.mp4"
]

# Generate Shot 3: Wide cinematic sunrise sweep over the prepared course
cmd3 = [
    "ffmpeg", "-y", "-loop", "1", "-i", IMG3,
    "-vf", "scale=3840:2160,zoompan=z='1.15-0.0006*on':x='(iw-iw/zoom)*(0.7-on*0.001)':y='ih/2-(ih/zoom/2)':d=180:s=1920x1080:fps=30",
    "-t", "6", "-c:v", "libx264", "-pix_fmt", "yuv420p", "tmp_video/shot3.mp4"
]

print("Rendering shot 1...")
subprocess.run(cmd1, check=True)
print("Rendering shot 2...")
subprocess.run(cmd2, check=True)
print("Rendering shot 3...")
subprocess.run(cmd3, check=True)

# Combine shots 1, 2, 3 with xfade crossfade transitions
# shot1: 6s (0-6s). xfade with shot2 at 4.5s for 1.5s duration -> shot1+shot2 total length: 4.5 + 6 = 10.5s
# xfade with shot3 at 9.0s for 1.5s duration -> total length: 9.0 + 6 = 15.0s
cmd_combine = [
    "ffmpeg", "-y",
    "-i", "tmp_video/shot1.mp4",
    "-i", "tmp_video/shot2.mp4",
    "-i", "tmp_video/shot3.mp4",
    "-filter_complex",
    "[0:v][1:v]xfade=transition=fade:duration=1.5:offset=4.5[v01];"
    "[v01][2:v]xfade=transition=fade:duration=1.5:offset=9.0[vfinal]",
    "-map", "[vfinal]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "tmp_video/combined.mp4"
]

print("Combining shots with crossfade...")
subprocess.run(cmd_combine, check=True)

# Now create seamless loop: take the last 1.5s and crossfade it with the first 1.5s
# Total length of combined.mp4 is 15 seconds.
# We cut into main (0 to 13.5s) and tail (13.5 to 15s) and crossfade tail over start.
# Or simpler and perfectly smooth:
# [0:v] split into [base] and [loop_tail]
# [base] from 0 to 13.5, [loop_tail] from 13.5 to 15
# blend loop_tail into start of base:
cmd_loop = [
    "ffmpeg", "-y",
    "-i", "tmp_video/combined.mp4",
    "-filter_complex",
    "[0:v]split=2[main][tail];"
    "[tail]trim=start=13.5:end=15,setpts=PTS-STARTPTS[tail_trim];"
    "[main]trim=start=0:end=13.5,setpts=PTS-STARTPTS[main_trim];"
    "[main_trim][tail_trim]xfade=transition=fade:duration=1.5:offset=0[vloop]",
    "-map", "[vloop]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "public/videos/golf-hero.mp4"
]

print("Rendering seamless loop MP4...")
subprocess.run(cmd_loop, check=True)

# Also generate high efficiency WebM
cmd_webm = [
    "ffmpeg", "-y",
    "-i", "public/videos/golf-hero.mp4",
    "-c:v", "libvpx-vp9", "-b:v", "2M", "-crf", "30", "-pix_fmt", "yuv420p",
    "public/videos/golf-hero.webm"
]

print("Rendering WebM...")
subprocess.run(cmd_webm, check=True)

# Generate the poster image from Shot 1 (at 1 second in)
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

print("ALL DONE!")
