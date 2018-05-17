export function uploadSpeakerAvatar(speakerId: number, avatar: File): Promise<Response> {
  const formData = new FormData();
  formData.append('file', avatar);

  return callApi('/admin/profile-picture/' + speakerId, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
}

export function deleteSpeakerAvatar(speakerId: number): Promise<Response> {
  return callApi('/admin/profile-picture/' + speakerId, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export function uploadBodyLogo(bodyId: number, logo: File): Promise<Response> {
  const formData = new FormData();
  formData.append('file', logo);

  return callApi('/admin/body-logo/' + bodyId, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
}

export function deleteBodyLogo(bodyId: number): Promise<Response> {
  return callApi('/admin/body-logo/' + bodyId, {
    method: 'DELETE',
    credentials: 'include',
  });
}

function callApi(url, options) {
  return fetch(url, options).then((response: Response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  });
}
