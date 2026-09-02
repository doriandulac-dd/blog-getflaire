import { testBlogConnection } from './generate-blog-sitemap.js';

const isConnected = await testBlogConnection();

if (!isConnected) {
  process.exitCode = 1;
}
