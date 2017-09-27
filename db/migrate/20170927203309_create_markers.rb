class CreateMarkers < ActiveRecord::Migration[5.1]
  def change
    create_table :markers do |t|
      t.string :address
      t.decimal :lat
      t.decimal :lng

      t.timestamps
    end
  end
end
