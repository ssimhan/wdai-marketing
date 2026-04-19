async function mailchimpFetch(
  url: string,
  method: 'POST' | 'PUT',
  apiKey: string,
  body: unknown,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new Error(`Mailchimp API error: ${response.status} ${response.statusText}`)
  }

  return response
}

export async function createMailchimpDraft(
  subject: string,
  content: string,
  audienceId: string,
  apiKey: string,
  server: string,
): Promise<string> {
  const baseUrl = `https://${server}.api.mailchimp.com/3.0`

  // Step 1: Create campaign
  const createRes = await mailchimpFetch(
    `${baseUrl}/campaigns`,
    'POST',
    apiKey,
    {
      type: 'regular',
      recipients: { list_id: audienceId },
      settings: {
        subject_line: subject,
        from_name: 'Women Defining AI',
        reply_to: 'team@womendefiningai.org',
      },
    },
  )

  const { id: campaignId } = (await createRes.json()) as { id: string }

  // Step 2: Set campaign content
  await mailchimpFetch(
    `${baseUrl}/campaigns/${campaignId}/content`,
    'PUT',
    apiKey,
    {
      html: `<html><body><pre style="font-family:sans-serif;white-space:pre-wrap">${content}</pre></body></html>`,
    },
  )

  return campaignId
}
