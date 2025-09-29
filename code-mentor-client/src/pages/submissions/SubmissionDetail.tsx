import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { ArrowLeftIcon, PlayIcon, AlertTriangleIcon, MessageCircleIcon, CheckCircleIcon } from 'lucide-react';
const SubmissionDetail = () => {
  return <div className="w-full">
      <div className="mb-6">
        <Link to="/submissions" className="inline-flex items-center text-[#0D47A1] mb-4">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Submissions
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Python Data Structures
            </h1>
            <div className="flex items-center text-gray-500">
              <span>Submitted by</span>
              <span className="font-medium text-gray-700 mx-1">
                Alex Johnson
              </span>
              <span>on Oct 13, 2023 at 8:45 PM</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Code Submission
              </h2>
              <button className="flex items-center text-[#0D47A1] text-sm font-medium">
                <PlayIcon size={16} className="mr-1" />
                Run Code
              </button>
            </div>
            <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm overflow-auto" style={{
            maxHeight: '500px'
          }}>
              <pre>{`def binary_search(arr, target):
    """
    Performs binary search on a sorted array.
    Args:
        arr: A sorted list of elements
        target: The element to find
    Returns:
        The index of the target element if found, otherwise -1
    """
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
def test_binary_search():
    # Test case 1: Element exists in the array
    arr1 = [1, 3, 5, 7, 9, 11, 13]
    assert binary_search(arr1, 7) == 3
    # Test case 2: Element does not exist
    assert binary_search(arr1, 8) == -1
    # Test case 3: Empty array
    assert binary_search([], 5) == -1
    # Test case 4: Single element array (element exists)
    assert binary_search([5], 5) == 0
    # Test case 5: Single element array (element doesn't exist)
    assert binary_search([5], 7) == -1
    print("All test cases passed!")
test_binary_search()`}</pre>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Execution Output
            </h2>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-auto" style={{
            maxHeight: '200px'
          }}>
              <pre className="text-green-600">All test cases passed!</pre>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex items-center mb-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">Grading</h2>
                <p className="text-gray-500">
                  Provide feedback and grade for this submission
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                <select className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700">
                  <option>Pending</option>
                  <option>Graded</option>
                  <option>Requires Revision</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade (out of 100)
              </label>
              <input type="number" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback to Student
              </label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent" rows={6} placeholder="Provide detailed feedback on the submission..."></textarea>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                Save Grade
              </button>
            </div>
          </Card>
          <Card>
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-yellow-100 p-2 mr-3">
                <AlertTriangleIcon size={20} className="text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  AI Plagiarism Detection
                </h2>
                <p className="text-gray-500">Similarity analysis results</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Similarity Score</span>
                <span className="text-sm font-medium text-yellow-600">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{
                width: '15%'
              }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Some code segments show similarity with common solutions found
                online. Review highlighted sections.
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium mb-2">Similar Sources</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  <span>GeeksforGeeks - Binary Search Implementation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  <span>GitHub - Data Structures & Algorithms Repository</span>
                </li>
              </ul>
            </div>
          </Card>
          <Card>
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 p-2 mr-3">
                <MessageCircleIcon size={20} className="text-[#0D47A1]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">AI Feedback</h2>
                <p className="text-gray-500">Automated code analysis</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-1">
                  <CheckCircleIcon size={14} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    Correct Implementation
                  </h3>
                  <p className="text-sm text-gray-600">
                    The binary search algorithm is correctly implemented with
                    the proper boundary conditions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-1">
                  <CheckCircleIcon size={14} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Good Documentation</h3>
                  <p className="text-sm text-gray-600">
                    The function includes a clear docstring explaining inputs,
                    outputs, and purpose.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-yellow-100 p-1 mr-2 mt-1">
                  <AlertTriangleIcon size={14} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    Performance Consideration
                  </h3>
                  <p className="text-sm text-gray-600">
                    The mid calculation could be optimized to prevent integer
                    overflow in some languages (not an issue in Python).
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-green-100 p-1 mr-2 mt-1">
                  <CheckCircleIcon size={14} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Thorough Testing</h3>
                  <p className="text-sm text-gray-600">
                    The test cases cover various scenarios including edge cases.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default SubmissionDetail;