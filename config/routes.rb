Rails.application.routes.draw do
root to: 'welcomes#index'

resources :users
resources :maps do
  resources :markers
end
resource :session, only: [:new, :create, :destroy]


  get 'maps/index'
  get 'sessions/index'
  get 'sessions/new'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
