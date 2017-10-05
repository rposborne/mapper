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
        format.html { redirect_to @map, notice: 'Map was successfully saved.'}
        format.json { render json: {redirect_to: map_path(@map)}, status: :created }
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

  def update
    @map = Map.find(params[:id])

    updated = @map.update({
      title: map_params[:title],
      description: map_params[:description],
      center: map_params[:center],
      zoom: map_params[:zoom],
      markers: map_params[:markers]
    })

    respond_to do |format|
      if @map.save
        format.html { redirect_to @map, notice: 'Map was successfully updated.'}
        format.json { render json: {redirect_to: map_path(@map)}, status: :created }
      else
        format.html { render 'new' }
        format.json { render json: @map.errors, status: :unproccessable_entity }
      end
    end
  end

  def destroy
    @map = Map.destroy(params[:id])
    respond_to do |format|
      format.html { redirect_to maps_path }
    end
  end

  private

    def map_params
      #params.require(:map).permit(:title, :description, :markers, :center, :zoom)
      params[:map]
    end

end
