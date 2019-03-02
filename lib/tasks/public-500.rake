# frozen_string_literal: true

# Generate public/500.html from the appropriate error controller action
#
# Run by
#   rake public/500.html
file "public/500.html" => ["app/views/layouts/application.html.erb"] do |t|
  print "Generating 500 page...\n"
  `curl --silent http://localhost:3000/error/500 -o public/500.html`
end
