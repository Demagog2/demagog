# frozen_string_literal: true

class ArticleController < FrontendController
  def index
    # Redirect pages to new url
    page = Page.published.friendly.find_by(slug: params[:slug])
    return redirect_to page_url(page), status: 301 if page

    @article = Article.kept.published.friendly.find(params[:slug])

    # Single statement article does not have any view, redirects directly to statement
    if @article.article_type.name == "single_statement"
      return redirect_to statement_url(@article.single_statement), status: 301
    end

    @article_type = @article.article_type.name == "default" ? "factcheck" : "editorial"

    @statements_filters = {}

    if @article_type == "factcheck"
      @statements_filters[:speaker_id] = params[:recnik].to_i if params[:recnik]

      if params[:hodnoceni]
        @statements_filters[:veracity_key] =
          case params[:hodnoceni]
          when "pravda"
            :true
          when "nepravda"
            :untrue
          when "zavadejici"
            :misleading
          when "neoveritelne"
            :unverifiable
          else
            nil
          end
      end
    end

    # return unless Rails.env.production?

    # TODO: revisit cache headers and do properly
    # expires_in 1.hour, public: true
    # if stale? @article, public: true
    #   respond_to do |format|
    #     format.html
    #   end
    # end
  end

  helper_method :replace_segment_text_html_special_strings
  def replace_segment_text_html_special_strings(text_html)
    playbuzz_quiz_html = <<-HEREDOC
<script>(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src='https://embed.playbuzz.com/sdk.js';fjs.parentNode.insertBefore(js,fjs);}(document,'script','playbuzz-sdk'));</script>
<div class="playbuzz" data-id="0c39f886-6c12-4243-9ff9-c2d890ae32c0" data-show-share="false" data-show-info="false" data-comments="false"></div>
    HEREDOC
    playbuzz_quiz_html =
      "<div style=\"margin-bottom: 1rem; background: white;\">" + playbuzz_quiz_html + "</div>"

    text_html.gsub(%r{(<p>\[playbuzzkviz\]<\/p>)}, playbuzz_quiz_html)
  end

  helper_method :promise_segment_widget_url
  def promise_segment_widget_url(promise_path)
    root_url(only_path: false).delete_suffix("/") + promise_path
  end
end
