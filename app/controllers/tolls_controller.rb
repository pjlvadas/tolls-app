class TollsController < ApplicationController
  
  def index
  	@tolls = Toll.all

  	render json: @tolls
  end

  def new
  	@toll = Toll.new
  end

  def create
  	@toll = Toll.create(toll_params)
  	@toll.save

  	respond_to do |format|
  		format.html { redirect_to "/tolls"}
  		format.json { render json: @toll }
  	end
  end

  def show
  	@toll = Toll.find(params[:id])

  	respond_to do |format|
  		format.html {}
  		format.json { render json: @toll }
  	end
  end

  def edit
  	@toll = Toll.find(params[:id])
  end

  def update
  	@toll = Toll.find(params[:id])
  	@toll.update(toll_params)

  	respond_to do |format|
  		format.html { redirect to "/tolls/#{@toll.id}" }
  		format.html { render json: @toll }
  	end
  end

  def destroy 
  	@toll = Toll.find(params[:id])
  	@toll.destroy

  	respond_to do |format|
  		format.html { redirect_to '/tolls' }
  		format.json { render json: @toll }
  	end
  end

  private

  def toll_params
  	params.require(:toll).permit(:name, :state, :description, :latitude, :longitude, :amount, :ez_pass, :on_route)
  end

end