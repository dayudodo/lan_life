# 压缩并去除所有mp3的metadata, 未完成，参见lrc.js
# 使用了多线程，速度快，因为生成的文件都是独立的没有啥冲突
outputDirectory = '.'

threads = []
Dir.glob(outputDirectory + '/*.mp3').each do |mp3FileName|
  # puts mp3FileName
  # command = "ffmpeg -i #{mp3FileName} -map 0:a -map_metadata -1 -ar 22050 -ab 32k -ac 1 -y #{mp3FileName}.mp3"
  # 如果需要在手机上播放，要注意兼容性问题，尤其是android, 推荐使用lame的CBR压缩！
  purename = File.basename(mp3FileName,'.*')
  command = "lame -b 32 -mm #{mp3FileName}  output#{purename}.mp3"
  # puts command
  # system command
  threads << Thread.new { system command }
end
threads.each(&:join)
