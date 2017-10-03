class UsersController < ApplicationController

  def index
      @user = User.all
    end

    def new
      @user = User.new
    end

    def show
      @user = User.find(params[:id])
    end

    def create
      @user = User.new(user_params)

      if @user.save
        session[:user_id] = @user.id
        redirect_to user_path @user
        else
          render 'new'
        end
    end

    def edit
      @user = User.find(params[:id])
    end

    def destroy
      @user = User.destroy(params[:id])
      respond_to do |format|
        format.html { redirect_to user_path }
      end
    end

    private

      def user_params
        params.require(:user).permit(:id, :email, :encrypted_password)
    end

  end
