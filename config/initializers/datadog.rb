Datadog.configure { |c| c.use :rails, service_name: "demagog-rails-app" } if Rails.env.production?
