# frozen_string_literal: true

require "addressable/uri"
require "nokogiri"

namespace :assessments do
  task :iframes_srcs, [] => [:environment] do |task, args|
    statements = Statement.all.includes(:assessment)

    iframes_srcs = []
    statements.each do |statement|
      fragment = Nokogiri::HTML.fragment(statement.assessment.explanation_html)

      fragment.css("iframe").each do |node|
        iframes_srcs.push(node["src"])
      end
    end

    hosts = {}
    iframes_srcs.each do |src|
      host = Addressable::URI.parse(src.strip).host
      hosts[host] = [] unless hosts.key?(host)
      hosts[host].push(src)
    end

    pp hosts
  end

  task :iframes_scripts, [] => [:environment] do |task, args|
    statements = Statement.all.includes(:assessment)

    iframes_scripts = []
    statements.each do |statement|
      fragment = Nokogiri::HTML.fragment(statement.assessment.explanation_html)

      fragment.css("script").each do |node|
        iframes_scripts.push(node["src"])
      end
    end

    pp iframes_scripts
  end
end
