class AddLatLngToMarkers < ActiveRecord::Migration[5.1]
  def change
    add_column :markers, :lat_lng, :json
  end
end
