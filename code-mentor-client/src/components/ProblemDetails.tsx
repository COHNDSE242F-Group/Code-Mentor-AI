import React from 'react';
import { FileTextIcon, TerminalIcon, ListIcon, CodeIcon } from 'lucide-react';

interface ProblemDetailsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProblemDetails: React.FC<ProblemDetailsProps> = ({
  activeTab,
  setActiveTab
}) => {

  const getTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div>
            <h2 className="text-xl font-medium text-white mb-3">
              Binary Search Tree Validation
            </h2>
            <p className="mb-3">
              Write a function that determines if a binary tree is a valid
              binary search tree (BST). A valid BST is defined as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>The left subtree of a node contains only nodes with keys less than the node's key.</li>
              <li>The right subtree of a node contains only nodes with keys greater than the node's key.</li>
              <li>Both the left and right subtrees must also be binary search trees.</li>
            </ul>
            <p>
              Your solution should handle edge cases such as empty trees and trees with only one node.
            </p>
          </div>
        );
      case 'io':
        return (
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Input:</h3>
            <p className="mb-3">
              Your function should take a binary tree as input. Each node in the tree will have the following structure:
            </p>
            <pre className="bg-[#232634] p-3 rounded-md mb-3">
{`class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }
}`}
            </pre>
            <h3 className="text-lg font-medium text-white mb-2">Output:</h3>
            <p>
              Return a boolean value: <code>true</code> if the tree is a valid BST, <code>false</code> otherwise.
            </p>
          </div>
        );
      case 'constraints':
        return (
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Constraints:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The number of nodes in the tree is in the range [0, 10000].</li>
              <li>-2³¹ ≤ Node.val ≤ 2³¹ - 1</li>
              <li>Your solution must run in O(n) time complexity, where n is the number of nodes in the tree.</li>
              <li>You may not modify the structure of the tree.</li>
              <li>You must complete this problem in the time allotted.</li>
            </ul>
          </div>
        );
      case 'examples':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Example 1:</h3>
              <pre className="bg-[#232634] p-3 rounded-md">
{`Input: [2,1,3]
    2
   / \\
  1   3
Output: true`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Example 2:</h3>
              <pre className="bg-[#232634] p-3 rounded-md">
{`Input: [5,1,4,null,null,3,6]
    5
   / \\
  1   4
     / \\
    3   6
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.`}
              </pre>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex-1 px-4 py-3 overflow-y-auto h-full"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none' // IE 10+
      }}
    >
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Edge */
          div::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}
      </style>
      {getTabContent()}
    </div>
  );
};

export default ProblemDetails;