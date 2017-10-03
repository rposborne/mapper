class AddCenterAndZoomToMap < ActiveRecord::Migration[5.1]
  def change
    add_column :maps, :center, :jsonb
    add_column :maps, :zoom, :integer
  end
end
