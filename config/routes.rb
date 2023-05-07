Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :invoices do
        member do
          post :approve
          post :reject
          post :purchase
          post :close
        end
      end
    end
  end
end
