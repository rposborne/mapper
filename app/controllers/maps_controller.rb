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

    respond_to do |format|
      if @map.save
        format.html { redirect_to @map, notice: 'Map was successfully saved'}
        format.json { render json: @map }
      else
        format.html { render 'new' }
        format.json { render json: @map.errors, status: :unproccessable_entity }
      end
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
      params.fetch(:map)
    end

end
