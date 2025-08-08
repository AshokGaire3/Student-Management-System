import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, AlertCircle, CheckCircle, Clock, FileText, X } from 'lucide-react';

interface MajorChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MajorChangeRequestModal: React.FC<MajorChangeRequestModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { majors, majorChangeRequests, getStudentMajor, submitMajorChangeRequest } = useData();
  
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !user || user.role !== 'student') return null;

  const currentMajor = getStudentMajor(user.id);
  const availableMajors = majors.filter(major => major.id !== currentMajor?.id);
  
  // Check if user has any pending requests
  const pendingRequest = majorChangeRequests.find(
    req => req.studentId === user.id && req.status === 'pending'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedMajorId) {
      setError('Please select a major');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the major change');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      submitMajorChangeRequest({
        studentId: user.id,
        currentMajorId: currentMajor!.id,
        requestedMajorId: selectedMajorId,
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0],
        reason: reason.trim()
      });

      setSuccess('Major change request submitted successfully! You will be notified once it is reviewed.');
      
      // Clear form
      setSelectedMajorId('');
      setReason('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingRequest) {
    const requestedMajor = majors.find(m => m.id === pendingRequest.requestedMajorId);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Request</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Under Review</h3>
            <p className="text-gray-600 mb-4">
              You already have a pending major change request from{' '}
              <span className="font-medium">{currentMajor?.majorName}</span> to{' '}
              <span className="font-medium">{requestedMajor?.majorName}</span>.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Submitted:</span> {pendingRequest.requestDate}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Reason:</span> {pendingRequest.reason}
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              Please wait for the current request to be processed before submitting a new one.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change Major</h2>
              <p className="text-gray-600 text-sm">Request to change your declared major</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Major Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Current Major</p>
                <p className="text-blue-900 font-semibold">
                  {currentMajor?.majorName} ({currentMajor?.majorCode})
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Major Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Major
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedMajorId}
                  onChange={(e) => setSelectedMajorId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="">Select new major</option>
                  {availableMajors.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.majorName} ({major.majorCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason for Change */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="Please explain why you want to change your major. Include any relevant academic interests, career goals, or experiences that led to this decision."
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters required. Be specific and detailed.
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Major change requests are reviewed by academic administrators. 
              You will be notified of the decision via your student dashboard. Processing typically takes 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajorChangeRequestModal;
