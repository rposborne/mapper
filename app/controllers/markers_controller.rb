class MarkersController < ApplicationController
  def index
    @markers = Marker.all
  end

  def new
    @marker = Marker.new
  end

  def create
    @map = Map.find(params[:map_id])
    @marker = @map.marker.build(marker_params)
  end

  private

    def marker_params
      params.require(:marker).permit(:address, :lat, :lng, :map_id)

end
