import test from 'node:test';
import assert from 'node:assert/strict';
import { professionTreeMarkup } from '../src/profession-tree.js';
import { escapeHtml } from '../src/career-ui.js';
import { careerTree } from '../src/careers.js';

test('the optional overview contains the entire subtree under the current choices', () => {
  const engineering = careerTree.find(node => node.id === 'engineering');
  const markup = professionTreeMarkup(engineering.children, escapeHtml);
  let count = 0;
  function visit(nodes) {
    for (const node of nodes) {
      count++;
      assert.ok(markup.includes(`<span>${escapeHtml(node.name)}</span>`), node.id);
      visit(node.children || []);
    }
  }
  visit(engineering.children);
  assert.equal((markup.match(/<span>/g) || []).length, count);
  assert.ok(!markup.includes('<span>Medicine</span>'));
  assert.doesNotMatch(markup, /<button|<a /);
});

test('the tree safely displays names as text', () => {
  assert.equal(professionTreeMarkup([{name: '<test>&"'}], escapeHtml), '<ul><li><span>&lt;test&gt;&amp;&quot;</span></li></ul>');
});
