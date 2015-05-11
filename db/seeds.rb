# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require_relative 'database_config'
require_relative 'models/toll'
# tolls = Toll.create([{
# 	name:,
# 	state:,
# 	description:,
# 	latitude:,
# 	longitude:,
# 	amount:,
# 	ez_pass:,
# 	on_route: false
# 	}
# 	])

COPY mytable FROM '/../../../desktop/toll_seed1.csv';




