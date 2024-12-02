import WebSocket from 'ws';

// Constants
export const DELETE = '3lcatutrcft2f';
export const LABEL_LIMIT = 1;

export const LABELS = [
  {
    rkey: '3lcatutonds2m',
    identifier: 'Rightwing Propaganda',
    locales: [
      {
        lang: 'en',
        name: 'Rightwing Propaganda',
        description:
          'Labels posts with links to certain rightwing news domains.',
      },
    ],
  },
];

// List of domains to match
const URL_DOMAINS = [
  'foxnews.com',
  'newsmax.com',
  'nypost.com',
  'oann.com',
  'washingtonexaminer.com',
  'theepochtimes.com',
  'dailymail.co.uk',
  'theblaze.com',
  'dailywire.com',
  'dailycaller.com',
  'westernjournal.com',
  'nationalreview.com',
  'washingtontimes.com',
  'townhall.com',
  'thegatewaypundit.com',
  'breitbart.com',
  'redstate.com',
  'hannity.com',
  'thefederalist.com',
  'dailysignal.com',
  'pjmedia.com',
  'twitchy.com',
  'wnd.com',
  'lifesitenews.com',
];

// Firehose URL
const FIREHOSE_URL = 'wss://jetstream.atproto.tools/subscribe';

// Utility Functions

/**
 * Extracts all URLs from a given text.
 * @param {string} text - The text to search for URLs.
 * @returns {string[]} Array of extracted URLs.
 */
function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * Checks if a post contains a prohibited link.
 * @param {string} postContent - The content of the post.
 * @returns {boolean} True if prohibited link is found, otherwise false.
 */
function containsProhibitedLink(postContent) {
  const urls = extractUrls(postContent);
  return urls.some(url => URL_DOMAINS.some(domain => url.includes(domain)));
}

/**
 * Labels posts with appropriate tags.
 * @param {Array} posts - Array of post objects.
 * @returns {Array} Array of labeled posts.
 */
export function labelPosts(posts) {
  return posts.map(post => {
    if (containsProhibitedLink(post.content)) {
      const existingLabels = post.labels || [];
      if (!existingLabels.includes('Rightwing Propaganda')) {
        return {
          ...post,
          labels: [...existingLabels, 'Rightwing Propaganda'],
        };
      }
    }
    return post;
  });
}

// WebSocket Connection

const ws = new WebSocket(FIREHOSE_URL);

ws.on('open', () => {
  console.log('Connected to the Bluesky firehose');
});

ws.on('message', (data) => {
  try {
    const parsedData = JSON.parse(data);
    // Assuming `parsedData` contains posts array
    const labeledPosts = labelPosts(parsedData.posts || []);
    labeledPosts.forEach(post => {
      console.log(`Post ID: ${post.id}, Labels: ${post.labels}`);
    });
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

ws.on('close', () => {
  console.log('Disconnected from the Bluesky firehose');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
