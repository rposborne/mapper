class RemoveLngFromMarkers < ActiveRecord::Migration[5.1]
  def change
    remove_column :markers, :lng, :decimal
  end
end
