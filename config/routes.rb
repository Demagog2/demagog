# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  devise_scope :user do
    get "sign_out", to: "devise/sessions#destroy", as: :destroy_user_session
  end

  get "rss/index"

  namespace :admin do
    # Imare uploading of article illustrations
    post "/article-illustration/:id" => "file_upload#upload_article_illustration", as: :upload_article_illustration
    delete "/article-illustration/:id" => "file_upload#delete_article_illustration", as: :delete_article_illustration

    # Image uploading of speaker portraits
    post "/profile-picture/:id" => "file_upload#upload_profile_picture", as: :upload_profile_picture
    delete "/profile-picture/:id" => "file_upload#delete_profile_picture", as: :delete_profile_picture

    # Image uploading of user avatars
    post "/user-avatar/:id" => "file_upload#upload_user_avatar", as: :upload_user_avatar
    delete "/user-avatar/:id" => "file_upload#delete_user_avatar", as: :delete_user_avatar

    # Image uploading of body logos
    post "/body-logo/:id" => "file_upload#upload_body_logo", as: :upload_body_logo
    delete "/body-logo/:id" => "file_upload#delete_body_logo", as: :delete_body_logo

    # Image uploading of content images
    post "/content-image" => "file_upload#upload_content_image", as: :upload_content_image

    # Become another user
    get "/become-another-user/:id" => "admin#become_another_user", as: :become_another_user

    # We're using this from the notification email
    get "/notification-open/:id" => "notification#open", as: :open_notification

    get "(/*all)" => "admin#index"
  end

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

  get "admin/statement/:id" => "admin/statement#edit"


  root to: "homepage#index"

  # Shortcut redirect
  get "workshopy", to: redirect("/diskuze/workshopy-demagogcz")

  # Redirects from legacy web server
  get "diskusie/:id/:slug" => "redirect#index", as: "redirect_discussion"
  get ":slug" => "redirect#index", as: "redirect_static"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
