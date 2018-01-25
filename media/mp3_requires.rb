# 生成require语句，react-native-video中的require只接受静态的参数！like
# const mp3Requires = {
#     sg01: require('../media/secret_garden/01.mp3'),
#     sg02:...
# }
directory = "secret_garden"
prefix = directory
dir_name = "#{directory}/*.mp3"

mp3Files =  Dir.glob(dir_name)
arrs = []

mp3Files.each do |f|
    pure_name = File.basename(f,'.*')
    # puts pure_name
    arrs << %Q`#{directory}_#{pure_name}: require('./#{pure_name}.mp3')`
end

# puts arrs
result = %Q`const mp3Requires = {
  #{arrs.join(",\n  ")}
};
export default mp3Requires;
`
puts result
dest_name = File.join(directory, 'mp3Requires.js')
File.open(dest_name, 'w') do |f|
    puts "write to #{dest_name} ..."
    f.write(result)
end