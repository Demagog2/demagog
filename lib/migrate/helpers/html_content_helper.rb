# frozen_string_literal: true

require "nokogiri"
require "htmlbeautifier"

class HtmlContentHelper
  def self.to_clean_html(dirty_html)
    fragment = Nokogiri::HTML.fragment(dirty_html)

    fragment.traverse do |node|
      # Remove tags which we don't support
      allowed = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "b", "strong", "i", "em", "a", "img", "iframe", "br", "ul", "ol", "li", "text"]
      unless allowed.include? node.name
        node.replace node.inner_html
        next
      end

      # Remove html attributes except the few we support
      node.keys.each do |attribute|
        next if node.name == "a" && attribute == "href"
        next if node.name == "img" && attribute == "src"
        next if node.name == "iframe" && attribute != "style"

        node.delete attribute
      end
    end

    # Replace all headers with h2
    fragment.css("h1, h2, h3, h4, h5, h6").each do |node|
      node.replace "<h2>" + node.inner_html + "</h2>"
    end

    # Replace all non-top-level h2 tags with paragraphs
    fragment.css("h2").each do |node|
      unless node.parent == fragment
        node.replace "<p>" + node.inner_html + "</p>"
      end
    end

    # Remove all tags from inside h2 other than a
    fragment.css("h2 *").each do |node|
      if node.name != "a" || node.name != "text"
        node.replace node.inner_html
      end
    end

    # Remove all unsupported tags from inside list items
    fragment.search("li *").each do |node|
      next if ["b", "strong", "i", "em", "a", "br"].include? node.name

      if node.name == "p" && !node.text.strip.empty?
        node.replace "<br>" + node.inner_html
        next
      end

      node.replace node.inner_html
    end

    nodes_to_remove = []
    fragment.css("img, iframe").each do |node|
      top_level_parent = node
      while top_level_parent && top_level_parent.parent != fragment do
        top_level_parent = top_level_parent.parent
      end

      if node != top_level_parent
        top_level_parent.after(node)
        nodes_to_remove << top_level_parent
      end
    end
    nodes_to_remove.each do |node|
      node.remove
    end

    # Remove whitespace-only text nodes
    fragment.traverse do |node|
      if node.name == "text" && node.text.strip.empty?
        node.remove
      end
    end

    # Wrap top level text nodes & sibling links to paragraphs
    top_level_text_node = fragment.xpath("text() | i | em | b | strong | a").first
    while !top_level_text_node.nil?
      new_paragraph_content = top_level_text_node.to_html

      next_node = top_level_text_node.next
      while next_node && (["text", "a", "i", "em", "b", "strong"].include?(next_node.name))
        next_node_content = next_node.to_html
        unless next_node_content.match(/^[.,;:)“]/) || new_paragraph_content.match(/[„(]$/)
          next_node_content = " " + next_node_content
        end

        new_paragraph_content += next_node_content

        if next_node.next
          next_node = next_node.next
          next_node.previous.remove
        else
          next_node.remove
          next_node = nil
        end
      end

      top_level_text_node.replace "<p>" + new_paragraph_content + "</p>"

      top_level_text_node = fragment.xpath("text() | i | em | b | strong | a").first
    end

    # Remove top level br tags
    fragment.traverse do |node|
      next unless node.parent == fragment

      if node.name == "br"
        node.remove
      end
    end

    # Remove empty paragraphs
    fragment.search("p").each do |node|
      if node.text.strip.empty?
        node.remove
      end
    end

    # Remove non-breaking spaces and newlines from paragraphs and list-items
    nbsp = Nokogiri::HTML("&nbsp;").text
    fragment.css("p, li").each do |node|
      node.inner_html = node.inner_html.gsub(nbsp, " ").gsub("\s+", " ")
      node.inner_html = node.inner_html.gsub(/(\s+)/, " ")
    end

    # Remove all starting & ending white space from inner html
    fragment.traverse do |node|
      node.inner_html = node.inner_html.strip
    end

    # Remove whitespace-only text nodes again
    fragment.traverse do |node|
      if node.name == "text" && node.text.strip.empty?
        node.remove
      end
    end

    # Remove all br tags at the beginnings or ends
    fragment.css("br").each do |node|
      if node.parent.children.first == node || node.parent.children.last == node
        node.remove
      end
    end

    # Strip whitespaces before and after br tags
    fragment.traverse do |node|
      if node.name == "text" && node.previous && node.previous.name == "br"
        node.content = node.text.lstrip
      end
      if node.name == "text" && node.next && node.next.name == "br"
        node.content = node.text.rstrip
      end
    end

    # Remove empty paragraphs
    fragment.search("p").each do |node|
      if node.text.strip.empty?
        node.remove
      end
    end

    HtmlBeautifier.beautify(fragment.to_html)
  end
end
