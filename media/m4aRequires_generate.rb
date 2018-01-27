# 生成require语句，react-native-video中的require只接受静态的参数！like
# const mp3Requires = {
#     sg01: require('../media/secret_garden/01.mp3'),
#     sg02:...
# }
directory = "secret_garden"
prefix = directory
dir_name = "#{directory}/*.m4a"

mp3Files =  Dir.glob(dir_name)
arrs = []

mp3Files.each do |f|
    pure_name = File.basename(f,'.*')
    # puts pure_name
    arrs << %Q`#{directory}_#{pure_name}: require('./#{pure_name}.m4a')`
end

# puts arrs
result = %Q`const m4aRequires = {
  #{arrs.join(",\n  ")}
};
export default m4aRequires;
`
puts result
dest_name = File.join(directory, 'm4aRequires.js')
File.open(dest_name, 'w') do |f|
    puts "write to #{dest_name} ..."
    f.write(result)
end