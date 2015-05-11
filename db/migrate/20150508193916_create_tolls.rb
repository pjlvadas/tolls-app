class CreateTolls < ActiveRecord::Migration
  def change
    create_table :tolls do |t|
    	t.string  :type
    	t.string  :direction
    	t.string  :amount
    	t.boolean :ez_pass
    	t.integer :plaza_id

    	t.timestamps
    end
  end
end
