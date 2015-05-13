class CreateTolls < ActiveRecord::Migration
  def change
    create_table :tolls do |t|
    	t.string  :name
        t.string  :state
        t.string  :description
    	t.float   :latitude
    	t.float   :longitude
    	t.float   :n_amount
        t.float   :s_amount
        t.boolean :on_route

    	t.timestamps
    end
  end
end
