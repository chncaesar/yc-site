import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const footer = await readFile(new URL('./Footer.astro', import.meta.url), 'utf8');
const consts = await readFile(new URL('../consts.ts', import.meta.url), 'utf8');

test('备案信息 has one configured ICP record and one public security record', () => {
	assert.match(consts, /icp:\s*{/);
	assert.match(consts, /publicSecurity:\s*{/);
	assert.match(consts, /label:\s*'[^']+ICP备\d+号'/);
	assert.match(consts, /label:\s*'[^']+公网安备\d+号'/);
	assert.match(consts, /recordCode:\s*'\d+'/);
	assert.match(consts, /recordcode=\d+'/);
});

test('footer renders备案 links from the shared configuration', () => {
	assert.match(footer, /import \{ BEIAN_INFO, SITE_TITLE \} from '\.\.\/consts';/);
	assert.match(footer, /href=\{BEIAN_INFO\.icp\.href\}/);
	assert.match(footer, /\{BEIAN_INFO\.icp\.label\}/);
	assert.match(footer, /href=\{BEIAN_INFO\.publicSecurity\.href\}/);
	assert.match(footer, /src=\{BEIAN_INFO\.publicSecurity\.logoSrc\}/);
	assert.match(footer, /alt=\{BEIAN_INFO\.publicSecurity\.logoAlt\}/);
	assert.match(footer, /\{BEIAN_INFO\.publicSecurity\.label\}/);
});
