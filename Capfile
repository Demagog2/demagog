# frozen_string_literal: true

# Load DSL and Setup Up Stages
require "capistrano/setup"
require "capistrano/deploy"

require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

require "capistrano/rvm"
require "capistrano/rails"
require "capistrano/bundler"
require "capistrano3/unicorn"

require "whenever/capistrano"

# Loads custom tasks from `lib/capistrano/tasks" if you have any defined.
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }

namespace :load do
  task :defaults do
    set :precompile_env,   fetch(:rails_env) || "production"
    set :assets_dir,       "public/assets"
    set :packs_dir,        "public/packs"
    set :rsync_cmd,        "rsync -av --delete"

    after "bundler:install", "deploy:assets:prepare"
  end
end

# Precompile files locally for faster deployment.
namespace :deploy do
  # Clear existing task so we can replace it rather than "add" to it.
  Rake::Task["deploy:compile_assets"].clear

  namespace :assets do
    desc "Precompile the assets locally and rsync to the server"
    task :prepare do
      run_locally do
        with rails_env: fetch(:precompile_env) do
          # Make sure we have node_modules up to date, webpacker checks this and we don't
          # want it to fail (see config.webpacker.check_yarn_integrity)
          execute "rm -rf node_modules && yarn install"

          # Remove all compiled assets
          execute "PRODUCTION_DATABASE_URL=postgresql:doesnt_exist SECRET_KEY_BASE=random rake assets:clobber"

          # And compile fresh new assets (includes JS apps)
          execute "RAILS_ENV=production PRODUCTION_DATABASE_URL=postgresql:doesnt_exist SECRET_KEY_BASE=random rake assets:precompile"
        end
      end

      on roles(:all) do |server|
        run_locally do
          execute "#{fetch(:rsync_cmd)} ./#{fetch(:assets_dir)}/ #{server.user}@#{server.hostname}:#{release_path}/#{fetch(:assets_dir)}/"
          execute "#{fetch(:rsync_cmd)} ./#{fetch(:packs_dir)}/ #{server.user}@#{server.hostname}:#{release_path}/#{fetch(:packs_dir)}/"
        end
      end
    end
  end
end
