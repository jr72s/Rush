import { Label } from './types.js';

export const DELETE = '3lcatutrcft2f';
export const LABEL_LIMIT = 1;

export const LABELS: Label[] = [
  {
    rkey: '3lcatutonds2m',
    identifier: 'Rightwing Propaganda',
    locales: [
      {
        lang: 'en',
        name: 'Rightwing Propaganda',
        description:
          'Labels posts with links to foxnews.com, newsmax.com, nypost.com, oann.com, washingtonexaminer.com, theepochtimes.com, dailymail.co.uk, theblaze.com, dailywire.com, dailycaller.com, westernjournal.com, nationalreview.com, washingtontimes.com, townhall.com, thegatewaypundit.com, breitbart.com, redstate.com, hannity.com, thefederalist.com, dailysignal.com, pjmedia.com. twitchy.com, wnd.com, lifesitenews.com',
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

// Function to check if a post contains a link to any specified domain
function containsProhibitedLink(postContent) {
  return URL_DOMAINS.some(domain => postContent.includes(domain));
}

// Function to label posts
export function labelPosts(posts) {
  return posts.map(post => {
    if (containsProhibitedLink(post.content)) {
      return {
        ...post,
        labels: [...(post.labels || []), 'Rightwing Propaganda'],
      };
    }
    return post;
  });
}
