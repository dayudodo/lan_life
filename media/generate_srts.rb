# 生成一个可用的、能够导入srts.js文件，内部已经格式化，模板写起来还是挺方便的！
directory = "secret_garden"
dir_name = "#{directory}/*.srt"

srtFiles =  Dir.glob(dir_name)
imps = []
arrs = []

srtFiles.each do |f|
    pure_name = File.basename(f,'.*')
    imps <<  %Q(import * as sg#{pure_name} from './#{pure_name}'\n)
    arrs << %Q(sg#{pure_name}.content)
end

result = %Q(#{imps.join}
const srtArr = [
  #{arrs.join(",\n  ")}
]
export {srtArr}
)

dest_name = File.join(directory, 'srts.js')
File.open(dest_name, 'w') do |f|
    puts "write to #{dest_name} ..."
    f.write(result)
end