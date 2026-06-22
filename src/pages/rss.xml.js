import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const interviews = await getCollection('interview');
	const healthPosts = await getCollection('health');
	const eventPosts = await getCollection('events');
	const posts = [...interviews, ...healthPosts, ...eventPosts].sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/${post.collection}/${post.id}/`,
		})),
	});
}
