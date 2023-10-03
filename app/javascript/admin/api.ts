/**
 * Interpolates params into the uri
 *
 * Given uri `/users/:id` and params `{ id: 1 }`
 * the function returns `/users/1`
 *
 * @param uri uri to be interpolated
 * @param params params to be included into the uri
 */
function interpolateParams(uri: string, params: Record<string, number | string>): string {
  return Object.keys(params).reduce<string>((tmpUri, paramName) => {
    return tmpUri.replace(`:${paramName}`, params[paramName].toString());
  }, uri);
}

function createImageUploader(uri: string) {
  return async(id: number | string, image: File): Promise<Response> => {
    const formData = new FormData();
    formData.append('file', image);

    return await callApi(interpolateParams(uri, { id }), {
      method: 'POST',
      body: formData,
    });
  };
}

function createImageDeleter(uri: string) {
  return async(id: number | string): Promise<Response> => {
    return await callApi(interpolateParams(uri, { id }), { method: 'DELETE' });
  };
}

async function callApi(url, options) {
  options.credentials = 'same-origin';

  return await fetch(url, options).then((response: Response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  });
}

export const uploadArticleIllustration = createImageUploader('/admin/article-illustration/:id');
export const deleteArticleIllustration = createImageDeleter('/admin/article-illustration/:id');

export const uploadUserAvatar = createImageUploader('/admin/user-avatar/:id');
export const deleteUserAvatar = createImageDeleter('/admin/user-avatar/:id');

export const uploadSpeakerAvatar = createImageUploader('/admin/profile-picture/:id');
export const deleteSpeakerAvatar = createImageDeleter('/admin/profile-picture/:id');

export const uploadBodyLogo = createImageUploader('/admin/body-logo/:id');
export const deleteBodyLogo = createImageDeleter('/admin/body-logo/:id');

export const uploadContentImage = async(image: File): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', image);

  return await callApi('/admin/content-image', {
    method: 'POST',
    body: formData,
  });
};

export const mailFactualStatementsExport = async() => {
  return await callApi('/admin/export/mail-factual-statements', { method: 'POST' });
};

export const generateIllustrationImageForTweet = async(
  tweetUrl: string,
  options: { withAttachment: boolean },
) => {
  const formData = new FormData();
  formData.append('tweet_url', tweetUrl);
  formData.append('with_attachment', options.withAttachment ? 'true' : 'false');

  return await callApi('/admin/article/generate-illustration-image-for-tweet', {
    method: 'POST',
    body: formData,
  });
};
