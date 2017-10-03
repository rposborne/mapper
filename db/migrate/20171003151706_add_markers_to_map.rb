class AddMarkersToMap < ActiveRecord::Migration[5.1]
  def change
    add_column :maps, :markers, :jsonb
  end
end
