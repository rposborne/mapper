class RemoveLatFromMarkers < ActiveRecord::Migration[5.1]
  def change
    remove_column :markers, :lat, :decimal
  end
end
