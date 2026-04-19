import { httpFetch } from './http-utils.js'

async function mailchimpFetch(
  url: string,
  method: 'POST' | 'PUT',
  apiKey: string,
  body: unknown,
): Promise<Response> {
  // Mailchimp Basic Auth requires any non-empty string as username; the API key is the password
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')

  try {
    return await httpFetch(url, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body,
    })
  } catch (err) {
    throw new Error(`Mailchimp API error: ${err instanceof Error ? err.message : String(err)}`)
  }
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
