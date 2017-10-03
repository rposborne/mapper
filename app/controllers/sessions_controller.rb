class SessionsController < ApplicationController
  def create
    user = User.find_by_email(params[:email])

    if @user && user.authenticate(params[:password_digest])
      session[:user_id] = user.id
      redirect_to users_path
    else
      redirect_to new_session_path
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to new_session_path
  end
end
