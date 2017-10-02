class RemoveAddressFromMarkers < ActiveRecord::Migration[5.1]
  def change
    remove_column :markers, :address, :string
  end
end
