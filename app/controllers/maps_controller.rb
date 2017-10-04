class MapsController < ApplicationController

  def index
    @maps = Map.all
  end

  def new
    @map = Map.new
  end

  def show
    @map = Map.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: @map }
    end
  end

  def create
    @map = Map.new({
      title: map_params[:title],
      description: map_params[:description],
      center: map_params[:center],
      zoom: map_params[:zoom],
      markers: map_params[:markers]
    })

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
    respond_to do |format|
      format.html
      format.json { render json: @map }
    end
  end

  def destroy

  end

  private

    def map_params
      #params.require(:map).permit(:title, :description, :markers, :center, :zoom)

      # security issue. must resolve before deployment!
      params[:map]
    end

end
