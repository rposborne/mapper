class UsersController < ApplicationController

  def index
      @user = User.all
    end


    private

      def user_params
        params.require(:user).permit(:id, :email, :encrypted_password)
    end

  end
