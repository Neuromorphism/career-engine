/** Optional overview of the same branches used by the path choices. */
export function professionTreeMarkup(nodes, escape) {
  return `<ul>${nodes.map(node => `<li><span>${escape(node.name)}</span>${node.children?.length ? professionTreeMarkup(node.children, escape) : ''}</li>`).join('')}</ul>`;
}
