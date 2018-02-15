# frozen_string_literal: true

Rails.application.routes.draw do
  get "rss/index"

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"

  post "/graphql", to: "graphql#execute"
  concern :paginatable do
    get "(page/:page)", action: :index, on: :collection, as: ""
  end

  get "vyrok/:id" => "statement#show", as: "statement"
  get "diskuze/:id" => "article#index", as: "article"
  get "vypis-recniku(/:id)" => "speaker#index", as: "speakers"
  get "politici/:id(/*name)" => "speaker#show", as: "speaker", concerns: :paginatable
  get "archiv" => "archive#index", as: "archive", concerns: :paginatable


  root to: "homepage#index"

  # Redirects from legacy web server
  get "diskusie/:id/:slug" => "redirect#index", as: "redirect_discussion"
  get ":slug" => "redirect#index", as: "redirect_static"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
