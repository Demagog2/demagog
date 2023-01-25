# frozen_string_literal: true

class ArticleController < FrontendController
  def index
    # Redirect pages to new url
    page = Page.published.friendly.find_by(slug: params[:slug])
    return redirect_to page_url(page), status: 301 if page

    @article = Article.kept.published.friendly.find(params[:slug])

    # Single statement article does not have any view, redirects directly to statement
    if @article.article_type.name == ArticleType::SINGLE_STATEMENT
      redirect_to statement_url(@article.single_statement), status: 301
    end

    # Old factcheck articles were using only speaker id in the "recnik" query param,
    # eg. ?recnik=123, so we want to redirect to the new quary param format
    if @article.article_type.name == ArticleType::DEFAULT && params[:recnik] && params[:recnik].match(/^\d+$/)
      speaker_id = params[:recnik].to_i
      speaker = Speaker.find_by(id: speaker_id)

      if speaker
        redirect_to article_url(@article, params: request.query_parameters.merge({ recnik: "#{speaker.full_name.parameterize}-#{speaker.id}" })), status: 301
      end
    end
  end

  def discussions
    articles_of_type(ArticleType::DEFAULT)
  end

  def social_media
    articles_of_type(ArticleType::SINGLE_STATEMENT)
  end

  def collaboration_with_facebook
    articles_of_type(ArticleType::FACEBOOK_FACTCHECK)
  end

  def presidential_election
    presidential_articles
  end

  def editorials
    articles_of_type(ArticleType::STATIC)
  end

  helper_method :replace_segment_text_html_special_strings
  def replace_segment_text_html_special_strings(text_html)
    playbuzz_quiz_html = <<-HEREDOC
<script>(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src='https://embed.playbuzz.com/sdk.js';fjs.parentNode.insertBefore(js,fjs);}(document,'script','playbuzz-sdk'));</script>
<div class="playbuzz" data-id="0c39f886-6c12-4243-9ff9-c2d890ae32c0" data-show-share="false" data-show-info="false" data-comments="false"></div>
    HEREDOC
    playbuzz_quiz_html =
      "<div style=\"margin-bottom: 1rem; background: white;\">" + playbuzz_quiz_html + "</div>"

    text_html.gsub(%r{(<p>\[playbuzzkviz\]</p>)}, playbuzz_quiz_html)
  end

  helper_method :promise_segment_widget_url
  def promise_segment_widget_url(promise_path)
    root_url(only_path: false).delete_suffix("/") + promise_path
  end

  private
    def presidential_articles
      if params[:page].present?
        @page_number = params[:page]
      end

      @articles = Article
        .kept
        .published
        .where(id: [
          1340,
          1338,
          1334,
          1331,
          1330,
          1328,
          1322,
          1320,
          1316,
          1315,
          1313,
          1312,
          1307,
          1308,
        ])
        .order(published_at: :desc)
        .page(@page_number)
        .per(10)


      @top_articles = @articles[0..3] || []
      @bottom_articles = @articles[4..9] || []
    end

  private
    def articles_of_type(article_type_name)
      if params[:page].present?
        @page_number = params[:page]
      end

      @articles = Article
        .kept
        .published
        .joins(:article_type)
        .where(article_types: { name: article_type_name })
        .order(published_at: :desc)
        .page(@page_number)
        .per(10)

      @top_articles = @articles[0..3] || []
      @bottom_articles = @articles[4..9] || []
    end
end
