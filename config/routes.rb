# frozen_string_literal: true

require "sidekiq/web"

Rails.application.routes.draw do
  get "page_controller/show"

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

    # Admin service policy - necessary for OAuth
    get "/policy" => "admin#policy"

    # Exports
    post "/export/mail-factual-statements" => "export#mail_factual_statements"
    get "/export/speakers" => "export#speakers"
    get "/export/statements-evaluation-process" => "export#statements_evaluation_process"

    # Misc
    post "/article/generate-illustration-image-for-tweet" => "article#generate_illustration_image_for_tweet", defaults: { format: "json" }, constraints: { format: "json" }

    # For development and testing we need a way to login as somebody even when
    # we don't have access to their Google account
    unless Rails.env.production?
      get "/test-login/:id" => "admin#test_login", as: :test_login
    end

    get "(/*all)" => "admin#index"
  end

  authenticate :user do
    mount Sidekiq::Web => "/sidekiq"
  end

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"

  post "/graphql", to: "graphql#execute"
  concern :paginatable do
    get "(page/:page)", action: :index, on: :collection, as: ""
  end

  get "vyroky" => "statement#index", as: "statements"
  get "vyrok/:id" => "statement#show", as: "statement"

  get "diskuze" => "article#discussions"
  get "socialni-site" => "article#social_media"
  get "spoluprace-s-facebookem" => "article#collaboration_with_facebook"
  get "komentare" => "article#editorials"

  get "diskuze/:slug" => "article#index", as: "article"
  get "vypis-recniku(/:id)" => "speaker#index", as: "speakers"
  get "politici/:id" => "speaker#show", as: "speaker", concerns: :paginatable
  # get "politici/:id(/*name)", to: redirect('/politici/%{id}', status: 302)
  get "archiv" => "archive#index", as: "archive", concerns: :paginatable
  get "stranka/:slug" => "page#show", as: "page"

  get "sliby" => "promises#index"
  get "sliby/:slug" => "promises#overview"
  get "sliby/:slug/metodika" => "promises#methodology"
  get "sliby/:slug/embed/:promise_id" => "promises#promise_embed"

  # get "sliby-sobotkovy-vlady/programove-prohlaseni" => "promises#document"
  get "sliby/:slug/programove-prohlaseni" => "promises#document"

  get "vyhledavani" => "search#index", as: "search"

  root to: "homepage#index"

  # Shortcut redirect
  get "workshopy", to: redirect("/diskuze/workshopy-demagogcz")
  get "tips", to: redirect("/diskuze/3-kroky-pro-rozpoznani-fake-news")

  # Dynamic error pages
  get "/404", to: "error#not_found"
  get "/422", to: "error#unprocessable_entity"
  get "/500", to: "error#internal_server_error"

  # Redirects from legacy web server
  get "diskusie/:id/:slug" => "redirect#index", as: "redirect_discussion"
  get ":slug" => "redirect#index", as: "redirect_static"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
