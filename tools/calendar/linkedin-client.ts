import { httpFetch } from './http-utils.js'

export async function postToLinkedIn(content: string, orgId: string, token: string): Promise<void> {
  const body = {
    author: `urn:li:organization:${orgId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: content },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  try {
    await httpFetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
      body,
    })
  } catch (err) {
    throw new Error(`LinkedIn API error: ${err instanceof Error ? err.message : String(err)}`)
  }
}
