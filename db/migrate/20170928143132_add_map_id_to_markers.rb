class AddMapIdToMarkers < ActiveRecord::Migration[5.1]
  def change
    add_column :markers, :map_id, :integer
  end
end
