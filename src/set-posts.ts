import { Bot } from '@skyware/bot';

import { BSKY_IDENTIFIER, BSKY_PASSWORD } from './config.js';
import { LABELS } from './constants.js';

const bot = new Bot();

try {
  await bot.login({
    identifier: BSKY_IDENTIFIER,
    password: BSKY_PASSWORD,
  });
} catch (error) {
  console.error('Error logging in: ', error);
  process.exit(1);
}
console.log('Continuing without deleting posts.');
const post = await bot.post({
  text: 'Like the replies to this post to receive labels.',
  threadgate: { allowLists: [] },
});

const labelNames = LABELS.map((label) => label.locales.map((locale) => locale.name).join(' | '));
const labelRkeys: Record<string, string> = {};
for (const labelName of labelNames) {
  const labelPost = await post.reply({ text: labelName });
  labelRkeys[labelName] = labelPost.uri.split('/').pop()!;
}

console.log('Label rkeys:');
for (const [name, rkey] of Object.entries(labelRkeys)) {
  console.log(`    name: '${name}',`);
  console.log(`    rkey: '${rkey}',`);
}

const deletePost = await bot.post({ text: 'Like this post to delete all labels.' });
const deletePostRkey = deletePost.uri.split('/').pop()!;
console.log('Delete post rkey:');
console.log(`export const DELETE = '${deletePostRkey}';`);

process.exit(0);
