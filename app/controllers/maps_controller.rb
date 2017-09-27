class MapsController < ApplicationController
  def index
    @maps = Map.all
  end

  def new
    @map = Map.new
  end

  def show
    @map = Map.find(params[:id])
  end

  def create
    @map = Map.new(map_params)
      if @map.save
        redirect_to @map
      else
        render 'new'
      end
  end

  def edit
    @map = Map.find(params[:id])
  end

  def destroy

  end

  private

    def map_params
      params.require(:map).permit(:title, :description)
      # will need marker permits here as well
    end

end
