# 从srt生成相同文件名的js文件，并且导出其内容content
directory = "secret_garden"
dir_name = "#{directory}/*.srt"

srtFiles =  Dir.glob(dir_name)
srtFiles.each do |f|
    # puts File.read(f)
    desti_name = File.join(directory, File.basename(f,'.*')+'.js')
    # content = %Q(export const content=`#{File.read(f)[1..-1]}`)
    content = %Q(export const content=`#{File.read(f, encoding: 'bom|utf-8')}`)
    # puts content
    # 奇怪的是所有文件开头都有个乱码，貌似只会在vs 里面显示么？

    File.open(desti_name, 'wb') do |f|
        puts "write to #{desti_name} ..."
        f.write(content)
    end
    
    # exit
    
end
