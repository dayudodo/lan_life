# 生成一个可用的、能够导入到SecondLevel的srts.js文件，已经格式化!
directory = "secret_garden"
prefix = directory
dir_name = "#{directory}/*.srt"

srtFiles =  Dir.glob(dir_name)
imps = []
arrs = []

srtFiles.each do |f|
    pure_name = File.basename(f,'.*')
    imps <<  %Q`import * as #{prefix}#{pure_name} from './#{pure_name}'\n`
    arrs << %Q`#{prefix}#{pure_name}.content`
end

result = %Q`#{imps.join}
const srtArr = [
  #{arrs.join(",\n  ")}
]
export {srtArr}
`

dest_name = File.join(directory, 'srts.js')
File.open(dest_name, 'w') do |f|
    puts "write to #{dest_name} ..."
    f.write(result)
end