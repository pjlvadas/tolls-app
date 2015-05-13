class CreateTolls < ActiveRecord::Migration
  def change
    create_table :tolls do |t|
    	t.string  :name
        t.string  :state
        t.string  :description
    	t.float   :latitude
    	t.float   :longitude
    	t.integer :n_amount
        t.integer :s_amount

    	t.timestamps
    end
  end
end
