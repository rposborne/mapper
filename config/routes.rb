Rails.application.routes.draw do
  devise_for :users
root to: 'welcomes#index'

resources :users
resources :maps do
  resources :markers
end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
