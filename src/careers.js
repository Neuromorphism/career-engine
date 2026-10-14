import { careerTree } from "./career-data.js?v=0.9.0";
export { careerTree };

export function findNode(path) {
  let nodes = careerTree;
  let current = null;
  for (const id of path) {
    current = nodes.find((node) => node.id === id) || null;
    if (!current) return null;
    nodes = current.children || [];
  }
  return current;
}

export function findNodeById(nodeId, nodes = careerTree, depth = 1) {
  for (const node of nodes) {
    if (node.id === nodeId) return { node, depth };
    const match = findNodeById(nodeId, node.children || [], depth + 1);
    if (match) return match;
  }
  return null;
}

export function nodesForPath(path) {
  const result = [];
  let nodes = careerTree;
  for (const id of path) {
    const node = nodes.find((item) => item.id === id);
    if (!node) break;
    result.push(node);
    nodes = node.children || [];
  }
  return result;
}

export function fieldForPath(path) {
  return path.length ? careerTree.find((node) => node.id === path[0]) || null : null;
}
