class CreatePlazas < ActiveRecord::Migration
  def change
    create_table :plazas do |t|
    	t.string  :name
    	t.string  :state
    	t.string  :interstate
    	t.string  :lat
    	t.string  :lng
    end
  end
end
