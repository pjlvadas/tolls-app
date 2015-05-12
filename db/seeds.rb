raw_input = File.open("#{Rails.root}/db/toll_seed1.csv")

raw_input = raw_input.read.split("\r")

raw_input.each do |column|

	name,
	state,
	description,
	latitude,
	longitude, 
	amount = column.split(",")

	Toll.create(
		:name => name,
		:state => state,
		:description => description,
		:latitude => latitude,
		:longitude => longitude,
		:amount => amount,
		:ez_pass => true,
		:on_route => false )
	end



