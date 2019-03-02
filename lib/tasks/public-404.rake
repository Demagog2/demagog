# frozen_string_literal: true

# Generate public/404.html from the appropriate error controller action
#
# Run by
#   rake public/404.html
file "public/404.html" => ["app/views/layouts/application.html.erb"] do |t|
  print "Generating 404 page...\n"
  `curl --silent http://localhost:3000/error/404 -o public/404.html`
end
