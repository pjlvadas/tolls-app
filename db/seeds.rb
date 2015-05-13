raw_input = File.open("#{Rails.root}/db/toll_seed2.csv")

raw_input = raw_input.read.split("\r")

raw_input.each do |column|

	name,
	state,
	description,
	latitude,
	longitude, 
	n_amount,
	s_amount = column.split(",")

	Toll.create(
		:name => name,
		:state => state,
		:description => description,
		:latitude => latitude,
		:longitude => longitude,
		:n_amount => n_amount,
		:s_amount => s_amount )
	end



